/**
 * Intercepta o botão físico de voltar do Android no Capacitor.
 * - Se há histórico: navega para a tela anterior
 * - Se não há histórico: pergunta se quer sair do app
 */
(function() {
  // Só executa dentro do Capacitor (Android/iOS)
  if (!window.Capacitor) return;

  document.addEventListener('deviceready', registrar, false);

  // Algumas versões do Capacitor já disparam antes do deviceready
  if (window.Capacitor.isNative) registrar();

  function registrar() {
    // Importa o plugin App do Capacitor
    const { App } = window.Capacitor.Plugins;
    if (!App) return;

    App.addListener('backButton', function(e) {
      // Se há histórico de navegação, volta
      if (window.history.length > 1) {
        window.history.back();
        return;
      }

      // Se estiver na tela raiz, perguntar se quer sair
      if (window.confirm('Deseja sair do app?')) {
        App.exitApp();
      }
    });
  }
})();
