/*---------------------------------------------------------
 * Copyright 2021 The Go Authors. All rights reserved.
 * Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------*/

import { Uri } from 'vscode';
import { CommandInvocation, ExtensionAPI } from './export';

const api: ExtensionAPI = {
	settings: {
		getExecutionCommand(toolName: string, resource?: Uri): CommandInvocation | undefined {
			return undefined;
		}
	}
};

export default api;
