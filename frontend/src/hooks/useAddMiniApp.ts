import { useCallback } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export const useAddMiniApp = () => {
  const addMiniApp = useCallback(async () => {
    try {
      // Check if we are running inside a Farcaster environment (e.g. Warpcast)
      // If we're just in a normal browser, these actions will fail because there's no parent frame to communicate with
      if (typeof window !== 'undefined' && window.parent !== window) {
        await sdk.actions.addMiniApp()
      } else {
        console.warn('addMiniApp skipped: Not running inside a Farcaster frame')
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('RejectedByUser')) {
          const rejectedError = new Error('RejectedByUser')
          rejectedError.cause = error
          throw rejectedError
        }
        if (error.message.includes('InvalidDomainManifestJson')) {
          const manifestError = new Error('InvalidDomainManifestJson')
          manifestError.cause = error
          throw manifestError
        }
      }
      throw error
    }
  }, [])

  return { addMiniApp }
}
