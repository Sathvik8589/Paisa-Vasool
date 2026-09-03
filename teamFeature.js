(function () {
  const TeamFeature = {
    state: {
      teams: [],
      selectedTeamId: null,
    },

    bind({ teamList, memberForm, collectionTeamSelect, collectionMemberSelect, collectionSummary, membersOverview }) {
      this.elements = {
        teamList,
        memberForm,
        collectionTeamSelect,
        collectionMemberSelect,
        collectionSummary,
        membersOverview,
      };
    },

    updateTeams(nextTeams, nextSelectedTeamId = null) {
      this.state.teams = nextTeams || [];
      this.state.selectedTeamId = nextSelectedTeamId || this.state.teams[0]?.id || null;
      this.renderTeams();
      this.renderCollectionOptions();
      this.renderMembersOverview();
    },

    setSelectedTeamId(teamId) {
      this.state.selectedTeamId = teamId;
      this.renderCollectionOptions();
      this.renderTeams();
      this.renderMembersOverview();
    },

    renderTeams() {
      const { teamList, memberForm } = this.elements;
      if (!teamList) return;

      if (!this.state.teams.length) {
        teamList.innerHTML = '<p class="empty-message">No teams created yet. Create your first team and add members.</p>';
        if (memberForm) memberForm.classList.add('hidden');
        return;
      }

      const activeTeam = this.state.teams.find((team) => team.id === this.state.selectedTeamId) || this.state.teams[0];
      this.state.selectedTeamId = activeTeam.id;

      if (memberForm) memberForm.classList.remove('hidden');

      teamList.innerHTML = this.state.teams
        .map(
          (team) => `
            <div class="team-item" data-id="${team.id}">
              <h4>${team.name}</h4>
              <ul class="member-list">
                ${(team.members || []).length ? team.members.map((member) => `<li>${member}</li>`).join('') : '<li>No members added yet</li>'}
              </ul>
            </div>
          `
        )
        .join('');

      teamList.querySelectorAll('.team-item').forEach((card) => {
        card.addEventListener('click', () => {
          this.setSelectedTeamId(card.dataset.id);
        });
      });
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

    renderMembersOverview() {
      const { membersOverview } = this.elements;
      if (!membersOverview) return;
      if (!this.state.teams.length) {
        membersOverview.innerHTML = '<p class="empty-message">No teams created yet.</p>';
        return;
      }
      membersOverview.innerHTML = this.state.teams.map((team) => `
        <article class="members-team-card">
          <h4>${team.name}</h4>
          <ul class="member-list">
            ${(team.members || []).length ? team.members.map((member) => `<li>${member}</li>`).join('') : '<li>No members added yet</li>'}
          </ul>
        </article>
      `).join('');
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

  window.TeamFeature = TeamFeature;
})();
