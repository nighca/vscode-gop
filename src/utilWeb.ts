import semver = require('semver');
import vscode = require('vscode');
import { extensionId } from './const';
import { outputChannel } from './goStatusWeb';

export class GoVersion {
	public sv?: semver.SemVer;
	// Go version tags are not following the strict semver format
	// so semver drops the prerelease tags used in Go version.
	// If sv is valid, let's keep the original version string
	// including the prerelease tag parts.
	public svString?: string;

	public isDevel?: boolean;
	private devVersion?: string;

	constructor(public binaryPath: string, public version: string) {
		const matchesRelease = /^go version go(\d\.\d+\S*)\s+/.exec(version);
		const matchesDevel = /^go version devel go(\d\.\d+\S*)\s+/.exec(version);
		if (matchesRelease) {
			// note: semver.parse does not work with Go version string like go1.14.
			const sv = semver.coerce(matchesRelease[1]);
			if (sv) {
				this.sv = sv;
				this.svString = matchesRelease[1];
			}
		} else if (matchesDevel) {
			this.isDevel = true;
			this.devVersion = matchesDevel[1];
		}
	}

	public isValid(): boolean {
		return !!this.sv || !!this.isDevel;
	}

	public format(includePrerelease?: boolean): string {
		if (this.sv) {
			if (includePrerelease && this.svString) {
				return this.svString;
			}
			return this.sv.format();
		}
		if (this.isDevel) {
			return `devel ${this.devVersion}`;
		}
		return 'unknown';
	}

	public lt(version: string): boolean {
		// Assume a developer version is always above any released version.
		// This is not necessarily true.
		if (this.isDevel || !this.sv) {
			return false;
		}
		const v = semver.coerce(version);
		if (!v) {
			return false;
		}
		return semver.lt(this.sv, v);
	}

	public gt(version: string): boolean {
		// Assume a developer version is always above any released version.
		// This is not necessarily true.
		if (this.isDevel || !this.sv) {
			return true;
		}
		const v = semver.coerce(version);
		if (!v) {
			return false;
		}
		return semver.gt(this.sv, v);
	}
}

export async function getGoVersion(goBinPath?: string): Promise<GoVersion> {
	const error = (msg: string) => {
		outputChannel.appendLine(msg);
		console.warn(msg);
		return new Error(msg);
	};

	throw error('TODO: unable to locate "go" binary');
}

export function getExtensionCommands(): any[] {
	const pkgJSON = vscode.extensions.getExtension(extensionId)?.packageJSON;
	if (!pkgJSON.contributes || !pkgJSON.contributes.commands) {
		return [];
	}
	const extensionCommands: any[] = vscode.extensions
		.getExtension(extensionId)
		?.packageJSON.contributes.commands.filter((x: any) => x.command !== 'gop.show.commands');
	return extensionCommands;
}
