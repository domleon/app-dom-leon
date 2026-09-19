# Capacitor — Dom Leon App Mobile

Documentação do ambiente de build mobile (Android/iOS) usando Capacitor.

---

## O que é o Capacitor

Camada fina que envolve o app web existente em uma shell nativa, permitindo publicação na Play Store (Android) e App Store (iOS) sem reescrever o código. O HTML/CSS/JS continua sendo a fonte da verdade — o Capacitor é apenas o "envelope" nativo.

```
Firebase Hosting (app web — continua igual)
         ↓
  Capacitor Shell
  ├── Android (WebView) → Play Store
  └── iOS (WKWebView)   → App Store (futuro — exige Mac)
```

---

## Ambiente de desenvolvimento

O desenvolvimento mobile é feito via **GitHub Codespaces** — VS Code completo no navegador, sem depender de máquina física.

| Recurso | Detalhe |
|---|---|
| Plataforma | GitHub Codespaces |
| Plano | Gratuito (120h/mês) |
| Repositório | https://github.com/domleon/app-dom-leon |
| URL do app | https://new-app-dom-leon.web.app |

---

## Versões instaladas

| Ferramenta | Versão |
|---|---|
| Node.js | v24.21.0 |
| npm | 11.19.0 |
| Git | 2.55.0 |
| Java JDK | 21.0.12 (openjdk) |
| Gradle | 8.14.3 |
| Android SDK | Build-Tools 34/35 · Platform 34/36 · Platform-Tools 37 |
| Capacitor Core | Latest |
| Capacitor CLI | Latest |
| Capacitor Android | Latest |

---

## Configuração do Capacitor

**`capacitor.config.json`** (raiz do projeto):
```json
{
  "appId": "br.com.domleon.app",
  "appName": "Dom Leon",
  "webDir": "public",
  "server": {
    "androidScheme": "https"
  }
}
```

---

## Estrutura de arquivos

```
app-dom-leon/
├── public/                    ← app web (HTML/CSS/JS)
├── android/                   ← projeto Android (Capacitor)
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       ├── assets/public/ ← cópia do app web (gerada por cap sync)
│   │       ├── java/br/com/domleon/app/
│   │       │   └── MainActivity.java
│   │       └── res/           ← ícones e splash screens
├── capacitor.config.json
├── package.json
├── .gitignore
└── README.md
```

> `node_modules/`, `android/build/` e `android/.gradle/` estão no `.gitignore` — não sobem para o GitHub.

---

## Variáveis de ambiente (Codespaces)

Salvas permanentemente no `~/.bashrc`:

```bash
export ANDROID_HOME=$HOME/android-sdk
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
```

Para recarregar em uma nova sessão:
```bash
source ~/.bashrc
```

---

## Fluxo de desenvolvimento

### Alterações no app web (rotina diária)
```
Edita arquivos em public/
      ↓
git add . && git commit -m "mensagem"
      ↓
git push
      ↓
GitHub Actions publica no Firebase automaticamente
      ↓
https://new-app-dom-leon.web.app atualizado
```
O APK já reflete as mudanças automaticamente — sem gerar novo APK.

### Gerar novo APK (quando necessário)
Gerar novo APK apenas quando:
- Mudar ícone ou splash screen
- Adicionar plugin nativo do Capacitor
- Publicar nova versão na Play Store

```bash
# 1. Sincronizar app web com Android
cd /workspaces/app-dom-leon
npx cap sync android

# 2. Gerar APK de debug
cd android
./gradlew assembleDebug

# 3. APK gerado em:
# android/app/build/outputs/apk/debug/app-debug.apk
```

### Distribuir APK para teste
Baixar o `app-debug.apk` pelo explorador do VS Code:
```
android → app → build → outputs → apk → debug → app-debug.apk
→ Botão direito → Download
```
Enviar para o celular via Google Drive, WhatsApp ou e-mail.

> ⚠️ Para instalar no Android: **Configurações → Segurança → Instalar apps desconhecidos** → habilitar para o app usado para transferir o APK.

---

## Comandos úteis

| Comando | O que faz |
|---|---|
| `npx cap sync android` | Copia arquivos do `public/` para o projeto Android |
| `npx cap copy android` | Só copia arquivos (sem atualizar plugins) |
| `./gradlew assembleDebug` | Gera APK de debug para testes |
| `./gradlew assembleRelease` | Gera APK de release (para a Play Store) |
| `./gradlew clean` | Limpa build anterior |
| `npx cap open android` | Abre Android Studio (se instalado) |

---

## Plataformas

### Android ✅
- Status: configurado e funcionando
- Build: APK de debug testado no celular
- Próximo passo: gerar APK de release assinado para a Play Store

### iOS ⏳
- Status: pendente — exige Mac com Xcode
- Opções futuras:
  - Mac local
  - GitHub Actions com runner macOS (~$0,08/minuto de build)
  - Codemagic (500 minutos/mês gratuitos)

---

## Pendências antes de publicar nas lojas

### Obrigatórias (ambas as lojas)
| # | Item | Status |
|---|---|---|
| 1 | Firebase Authentication real | ⏳ Pendente |
| 2 | Mercado Pago integrado | ⏳ Pendente |
| 3 | Política de privacidade (URL pública) | ⏳ Pendente |
| 4 | Termos de uso (URL pública) | ⏳ Pendente |
| 5 | Ícone do app (1024×1024) | ⏳ Pendente |
| 6 | Splash screen com identidade Dom Leon | ⏳ Pendente |
| 7 | Conta de teste para revisores | ⏳ Pendente |

### Play Store (Android)
| # | Item | Status |
|---|---|---|
| 8 | Conta Google Play Console ($25 único) | ⏳ Pendente |
| 9 | APK de release assinado (.aab) | ⏳ Pendente |
| 10 | Screenshots (mín. 2 · 1080×1920) | ⏳ Pendente |
| 11 | Feature graphic (1024×500) | ⏳ Pendente |
| 12 | Digital Asset Links (assetlinks.json) | ⏳ Pendente |
| 13 | Classificação de conteúdo (IARC) | ⏳ Pendente |
| 14 | Seção de segurança de dados preenchida | ⏳ Pendente |

### App Store (iOS) — futuro
| # | Item | Status |
|---|---|---|
| 15 | Mac com Xcode | ⏳ Sem acesso |
| 16 | Conta Apple Developer ($99/ano) | ⏳ Pendente |
| 17 | Build iOS via Xcode ou Codemagic | ⏳ Pendente |
| 18 | Screenshots iPhone + iPad | ⏳ Pendente |

---

## Histórico

| Data | O que foi feito |
|---|---|
| 19/09/2026 | Codespaces configurado, Capacitor instalado, plataforma Android adicionada, APK de debug gerado e testado no celular |
