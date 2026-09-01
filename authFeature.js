(function () {
  const AuthFeature = {
    elements: {},

    bind({ loginForm, signupForm, signupBtn, backToLoginBtn, authMessage, loginInput, passwordInput, signupUsername, signupEmail, signupPassword, signupConfirmPassword, signupMobile, signupTeamName }) {
      this.elements = {
        loginForm,
        signupForm,
        signupBtn,
        backToLoginBtn,
        authMessage,
        loginInput,
        passwordInput,
        signupUsername,
        signupEmail,
        signupPassword,
        signupConfirmPassword,
        signupMobile,
        signupTeamName,
      };
    },

    setHandlers({ onLogin, onSignup, onShowSignup, onShowLogin }) {
      const { loginForm, signupForm, signupBtn, backToLoginBtn, loginInput, passwordInput, signupUsername, signupEmail, signupPassword, signupConfirmPassword, signupMobile, signupTeamName } = this.elements;

      loginForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (typeof onLogin !== 'function') return;

        const login = loginInput?.value.trim() || '';
        const password = passwordInput?.value.trim() || '';
        await onLogin({ login, password });
      });

      signupBtn?.addEventListener('click', async () => {
        if (typeof onShowSignup === 'function') {
          onShowSignup();
        }
      });

      backToLoginBtn?.addEventListener('click', async () => {
        if (typeof onShowLogin === 'function') {
          onShowLogin();
        }
      });

      signupForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (typeof onSignup !== 'function') return;

        const username = signupUsername?.value.trim() || '';
        const email = signupEmail?.value.trim() || '';
        const password = signupPassword?.value.trim() || '';
        const confirmPassword = signupConfirmPassword?.value.trim() || '';
        const mobileNumber = signupMobile?.value.trim() || '';
        const teamName = signupTeamName?.value.trim() || '';

        await onSignup({ username, email, password, confirmPassword, mobileNumber, teamName });
      });
    },

    setMode(isSignup) {
      const { loginForm, signupForm } = this.elements;
      loginForm?.classList.toggle('hidden', isSignup);
      signupForm?.classList.toggle('hidden', !isSignup);
    },

    setMessage(message, isError = false) {
      if (!this.elements.authMessage) return;
      this.elements.authMessage.textContent = message;
      this.elements.authMessage.style.color = isError ? 'var(--danger)' : 'var(--success)';
    },
  };

  window.AuthFeature = AuthFeature;
})();
