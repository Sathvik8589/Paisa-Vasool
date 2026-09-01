(function () {
  const TeamMembersFeature = {
    elements: {},

    bind({ teamForm, teamNameInput, teamHeadInput, memberForm, memberNameInput, onCreateTeam, onAddMember }) {
      this.elements = {
        teamForm,
        teamNameInput,
        teamHeadInput,
        memberForm,
        memberNameInput,
        onCreateTeam,
        onAddMember,
      };

      this.elements.teamForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (typeof this.elements.onCreateTeam !== 'function') return;

        const name = this.elements.teamNameInput?.value.trim() || '';
        const headName = this.elements.teamHeadInput?.value.trim() || '';
        await this.elements.onCreateTeam({ name, headName });
      });

      this.elements.memberForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (typeof this.elements.onAddMember !== 'function') return;

        const memberName = this.elements.memberNameInput?.value.trim() || '';
        await this.elements.onAddMember({ memberName });
      });
    },

    setMemberFormVisible(isVisible) {
      if (!this.elements.memberForm) return;
      this.elements.memberForm.classList.toggle('hidden', !isVisible);
    },
  };

  window.TeamMembersFeature = TeamMembersFeature;
})();
