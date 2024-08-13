//
// Copyright © 2020 Anticrm Platform Contributors.
//
// Licensed under the Eclipse Public License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License. You may
// obtain a copy of the License at https://www.eclipse.org/legal/epl-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

import { type Resources } from '@hcengineering/platform'

import NewRecordingButton from './components/NewRecordingButton.svelte'
import RecordingPopup from './components/RecordingPopup.svelte'
import { showPopup } from '@hcengineering/ui'
import RecordingSettings from './components/RecordingSettings.svelte'
import { writable } from 'svelte/store'

export default async (): Promise<Resources> => ({
  component: {
    NewRecordingButton
  },
  function: {
    openRecordingOverlay
  }
})

export const recordingStates = [
  // hacky way to send an event
  'updateOptions',
  'init',
  'countdown',
  'recording',
  'paused',
  'cancelled',
  'finished'
] as const

export const shareTypes = [
  'fullScreen',
  'thisWindow',
  'thisTab',
  'cameraOnly'
] as const
export type ShareType = typeof shareTypes[number]
export interface RecordingOptions {
  countdown: boolean
  shareType: ShareType
  microphone: string
  camera: string
}
export const defaultRecordingOptions: RecordingOptions = {
  countdown: true,
  shareType: 'fullScreen',
  microphone: 'default',
  camera: 'default'
}
export class RecordingState {
  state: typeof recordingStates[number]
  options?: RecordingOptions
  id: number
  // smh there should be a better way to do this
  static globalId: number = 0

  constructor (state: typeof recordingStates[number], options?: RecordingOptions) {
    this.state = state
    this.options = options
    this.id = RecordingState.globalId++
  }
}

export const defaultRecordingState = new RecordingState('init')

const recordingState = writable<RecordingState>()

export function openRecordingOverlay (): void {
  recordingState.set(defaultRecordingState)
  showPopup(
    RecordingPopup,
    { recordingState },
    {
      movable: true,
      options: {
        bottom: 0,
        left: 0
      }
    },
    undefined, undefined,
    { category: 'recordingPopup', overlay: false, persistent: true }
  )
  showPopup(RecordingSettings,
    { recordingState },
    'right',
    undefined, undefined,
    { category: 'recordingSettings', overlay: true }
  )
}
