import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'

export async function configureStatusBar() {
  if (Capacitor.getPlatform() === 'web') return

  try {
    await StatusBar.setStyle({ style: Style.Light })        // Style clair
    await StatusBar.setBackgroundColor({ color: '#ffffff' }) // Couleur blanche
    await StatusBar.show()                                   // Affiche la barre si elle est cachée
  } catch (error) {
    console.warn('StatusBar error:', error)
  }
}
