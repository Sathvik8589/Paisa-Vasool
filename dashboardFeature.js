(function () {
  const DashboardFeature = {
    elements: {},

    bind({ navButtons, viewPanels, viewTitle, menuToggle, sidebar, onViewChange }) {
      this.elements = {
        navButtons: navButtons || [],
        viewPanels: viewPanels || [],
        viewTitle,
        menuToggle,
        sidebar,
        onViewChange,
      };

      this.elements.navButtons.forEach((button) => {
        button.addEventListener('click', () => {
          if (typeof this.elements.onViewChange === 'function') {
            this.elements.onViewChange(button.dataset.view);
          }
        });
      });

      this.elements.menuToggle?.addEventListener('click', () => {
        this.elements.sidebar?.classList.toggle('collapsed');
      });
    },

    setActiveView(viewName) {
      const { navButtons, viewPanels, viewTitle } = this.elements;

      navButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.view === viewName);
      });

      viewPanels.forEach((panel) => {
        const isActive = panel.id === `${viewName}View`;
        panel.classList.toggle('active', isActive);
      });

      const titles = {
        team: 'Team',
        members: 'Team Members',
        collection: 'Money Collection',
        calculator: 'Calculator',
        interest: 'Interest Calculator',
        profile: 'Profile',
        settings: 'Settings',
      };

      if (viewTitle) {
        viewTitle.dataset.view = viewName;
        viewTitle.textContent = titles[viewName] || 'Dashboard';
      }

      window.LanguageFeature?.updateViewTitle();
    },
  };

  window.DashboardFeature = DashboardFeature;
})();
