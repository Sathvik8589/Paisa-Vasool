(function () {
  const MoneyCollectionFeature = {
    state: {
      teams: [],
      selectedTeamId: null,
    },

    elements: {},

    bind({ collectionTeamSelect, collectionMemberSelect, collectionSummary }) {
      this.elements = {
        collectionTeamSelect,
        collectionMemberSelect,
        collectionSummary,
      };
    },

    updateTeams(nextTeams = [], nextSelectedTeamId = null) {
      this.state.teams = nextTeams || [];
      this.state.selectedTeamId = nextSelectedTeamId || this.state.teams[0]?.id || null;
      this.renderCollectionOptions();
    },

    setSelectedTeamId(teamId) {
      this.state.selectedTeamId = teamId;
      this.renderCollectionOptions();
    },

    renderCollectionOptions() {
      const { collectionTeamSelect, collectionMemberSelect, collectionSummary } = this.elements;
      if (!collectionTeamSelect || !collectionMemberSelect || !collectionSummary) return;

      if (!this.state.teams.length) {
        collectionTeamSelect.innerHTML = '<option value="">No teams</option>';
        collectionMemberSelect.innerHTML = '<option value="">No members</option>';
        collectionSummary.innerHTML = '<p class="empty-message">Create a team to begin collecting money.</p>';
        return;
      }

      const selectedTeam = this.state.teams.find((team) => team.id === this.state.selectedTeamId) || this.state.teams[0];
      this.state.selectedTeamId = selectedTeam.id;

      collectionTeamSelect.innerHTML = this.state.teams
        .map(
          (team) => `<option value="${team.id}" ${team.id === selectedTeam.id ? 'selected' : ''}>${team.name}</option>`
        )
        .join('');

      collectionMemberSelect.innerHTML = (selectedTeam.members || [])
        .map((member) => `<option value="${member}">${member}</option>`)
        .join('') || '<option value="">No members</option>';

      this.renderCollectionSummary(selectedTeam);
    },

    renderCollectionSummary(team) {
      const { collectionSummary } = this.elements;
      if (!collectionSummary) return;

      if (!team || !team.collections || !team.collections.length) {
        collectionSummary.innerHTML = '<p class="empty-message">No collections recorded yet.</p>';
        return;
      }

      const total = team.collections.reduce((sum, item) => sum + Number(item.amount || 0), 0);

      collectionSummary.innerHTML = `
        <div class="collection-item">
          <h4>${team.name}</h4>
          <p><strong>Total collected:</strong> ${total.toFixed(2)}</p>
          <ul class="member-list">
            ${team.collections
              .map(
                (item) => `<li>${item.memberName} paid ${Number(item.amount).toFixed(2)} for ${item.eventName}</li>`
              )
              .join('')}
          </ul>
        </div>
      `;
    },
  };

  window.MoneyCollectionFeature = MoneyCollectionFeature;
})();
