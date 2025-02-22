import * as path from 'path'
import { Injectable } from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { HostAppService, Platform } from 'terminus-core'

import { ShellProvider } from '../api/shellProvider'
import { Shell } from '../api/interfaces'

/* eslint-disable block-scoped-var */

try {
    var wnr = require('windows-native-registry') // eslint-disable-line @typescript-eslint/no-var-requires
} catch { }

/** @hidden */
@Injectable()
export class Cygwin32ShellProvider extends ShellProvider {
    constructor (
        private domSanitizer: DomSanitizer,
        private hostApp: HostAppService,
    ) {
        super()
    }

    async provide (): Promise<Shell[]> {
        if (this.hostApp.platform !== Platform.Windows) {
            return []
        }

        const cygwinPath = wnr.getRegistryValue(wnr.HK.LM, 'Software\\WOW6432Node\\Cygwin\\setup', 'rootdir')

        if (!cygwinPath) {
            return []
        }

        return [{
            id: 'cygwin32',
            name: 'Cygwin (32 bit)',
            command: path.join(cygwinPath, 'bin', 'bash.exe'),
            icon: this.domSanitizer.bypassSecurityTrustHtml(require('../icons/cygwin.svg')),
            env: {
                TERM: 'cygwin',
            },
        }]
    }
}
