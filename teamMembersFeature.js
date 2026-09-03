(function () {
  const TeamMembersFeature = {
    elements: {},

    bind({ teamForm, teamNameInput, teamHeadOneInput, teamHeadTwoInput, teamHeadThreeInput, memberForm, memberNameInput, onCreateTeam, onAddMember }) {
      this.elements = {
        teamForm,
        teamNameInput,
        teamHeadOneInput,
        teamHeadTwoInput,
        teamHeadThreeInput,
        memberForm,
        memberNameInput,
        onCreateTeam,
        onAddMember,
      };

      this.elements.teamForm?.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (typeof this.elements.onCreateTeam !== 'function') return;

        const name = this.elements.teamNameInput?.value.trim() || '';
        const headNames = [
          this.elements.teamHeadOneInput?.value.trim() || '',
          this.elements.teamHeadTwoInput?.value.trim() || '',
          this.elements.teamHeadThreeInput?.value.trim() || '',
        ];
        await this.elements.onCreateTeam({ name, headNames });
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
