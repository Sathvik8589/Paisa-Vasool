(function () {
  const LanguageFeature = {
    state: {
      currentLanguage: 'en',
      translations: {
        en: {
          brand: 'Paisa Vasool',
          welcome: 'Welcome back',
          login: 'Login',
          username: 'Username',
          password: 'Password',
          forgotPassword: 'Forgot password?',
          signIn: 'Sign In',
          createAccount: 'Create account',
          team: 'Team',
          moneyCollection: 'Money Collection',
          logout: 'Logout',
        },
        te: {
          brand: 'పైసా వసూల్',
          welcome: 'మళ్లీ స్వాగతం',
          login: 'లాగిన్',
          username: 'వినియోగదారు పేరు',
          password: 'పాస్వర్డ్',
          forgotPassword: 'పాస్వర్డ్ మర్చిపోయారా?',
          signIn: 'సైన్ ఇన్',
          createAccount: 'ఖాతా సృష్టించండి',
          team: 'టీమ్',
          moneyCollection: 'డబ్బు సేకరణ',
          logout: 'లాగ్అవుట్',
        },
        hi: {
          brand: 'पैसा वसूल',
          welcome: 'वापसी पर स्वागत है',
          login: 'लॉगिन',
          username: 'उपयोगकर्ता नाम',
          password: 'पासवर्ड',
          forgotPassword: 'पासवर्ड भूल गए?',
          signIn: 'साइन इन',
          createAccount: 'अकाउंट बनाएं',
          team: 'टीम',
          moneyCollection: 'पैसे की वसूली',
          logout: 'लॉग आउट',
        },
      },
    },

    elements: {},

    bind({ languageSelect }) {
      this.elements.languageSelect = languageSelect;
      languageSelect?.addEventListener('change', (event) => {
        this.state.currentLanguage = event.target.value;
        this.applyTranslations();
      });
      this.applyTranslations();
    },

    applyTranslations() {
      const { currentLanguage, translations } = this.state;
      const selected = translations[currentLanguage] || translations.en;

      document.querySelector('.brand-tag') && (document.querySelector('.brand-tag').textContent = selected.brand);
      document.querySelector('.login-kicker') && (document.querySelector('.login-kicker').textContent = selected.welcome);
      document.querySelector('.login-header h2') && (document.querySelector('.login-header h2').textContent = selected.login);

      const usernameLabel = document.querySelector('#loginForm label span');
      if (usernameLabel) usernameLabel.textContent = selected.username;

      const passwordLabel = document.querySelectorAll('#loginForm label span')[1];
      if (passwordLabel) passwordLabel.textContent = selected.password;

      const forgotLink = document.querySelector('.link-row a');
      if (forgotLink) forgotLink.textContent = selected.forgotPassword;

      const signInButton = document.querySelector('#loginForm .primary-btn');
      if (signInButton) signInButton.textContent = selected.signIn;

      const createButton = document.querySelector('#signupBtn');
      if (createButton) createButton.textContent = selected.createAccount;

      const navTeam = document.querySelector('[data-view="team"]');
      if (navTeam) navTeam.textContent = selected.team;

      const navCollection = document.querySelector('[data-view="collection"]');
      if (navCollection) navCollection.textContent = selected.moneyCollection;

      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) logoutBtn.textContent = selected.logout;
    },
  };

  window.LanguageFeature = LanguageFeature;
})();
