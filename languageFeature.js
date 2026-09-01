(function () {
  const translations = {
    en: {
      brand: 'Paisa Vasool',
      welcome: 'Welcome back',
      login: 'Login',
      username: 'Username',
      password: 'Password',
      forgotPassword: 'Forgot password?',
      signIn: 'Sign In',
      createAccount: 'Create account',
      createAccountBtn: 'Create Account',
      backToLogin: 'Back to login',
      heroEyebrow: 'Smart team money tracking',
      heroTitle: 'Track every rupee, team, and event with clarity.',
      heroLead: 'Create teams, assign members, calculate interest, and manage collections with a simple dashboard built for daily financial tracking.',
      badge1: 'Team tracking',
      badge2: 'Collection reports',
      badge3: 'Calculator tools',
      membersTracked: 'members tracked',
      activeTeams: 'active teams',
      collected: 'collected',
      explorePaisaVasool: 'Explore Paisa Vasool',
      exploreEyebrow: 'A quick look around',
      exploreTitle: 'Everything you need to keep money moving.',
      loginPlaceholder: 'Enter username',
      passwordPlaceholder: 'Enter password',
      signupUsername: 'Username',
      signupEmail: 'Email',
      signupMobile: 'Mobile Number',
      signupPassword: 'Password',
      signupConfirmPassword: 'Confirm Password',
      signupTeamName: 'Team Name (optional)',
      signupPlaceholderUsername: 'Enter username',
      signupPlaceholderEmail: 'Enter email address',
      signupPlaceholderMobile: 'Enter mobile number',
      signupPlaceholderPassword: 'Create password',
      signupPlaceholderConfirmPassword: 'Confirm password',
      signupPlaceholderTeamName: 'Enter team name',
      navTeam: 'Team',
      navCollection: 'Money Collection',
      navCalculator: 'Calculator',
      navInterest: 'Interest Calc',
      showProfile: 'Show Profile',
      editProfile: 'Edit Profile',
      settings: 'Settings',
      logout: 'Logout',
      featureTeamTitle: 'Feature: Team',
      featureTeamDescription: 'Create a new team and add team members by name.',
      teamNameLabel: 'Team Name',
      teamHeadLabel: 'Team Head',
      createTeam: 'Create Team',
      noTeams: 'No teams created yet. Create your first team and add members.',
      addTeamMember: 'Add Team Member',
      addMember: 'Add Member',
      featureCollectionTitle: 'Feature: Money Collection',
      featureCollectionDescription: 'Track event contributions from each team member and keep the same team linked across all activities.',
      selectTeam: 'Select Team',
      event: 'Event',
      memberNameLabel: 'Member Name',
      amount: 'Amount',
      collectMoney: 'Collect Money',
      featureCalculatorTitle: 'Feature: Calculator',
      featureCalculatorDescription: 'Use a practical calculator for day-to-day arithmetic needs.',
      expression: 'Expression',
      calculate: 'Calculate',
      result: 'Result',
      featureInterestTitle: 'Feature: Interest Amount Calculator',
      featureInterestDescription: 'Calculate loan or advance interest using the amount, dates, and interest rate.',
      amountTaken: 'Amount Taken',
      interestRate: 'Interest Rate (%)',
      takenDate: 'Amount Taken Date',
      returnDate: 'Return Date',
      calculateInterest: 'Calculate Interest',
      interest: 'Interest',
      totalAmount: 'Total Amount',
      teamNamePlaceholder: 'Example: Event Crew',
      teamHeadPlaceholder: 'Example: Raj',
      memberNamePlaceholder: 'Member name',
      eventPlaceholder: 'Example: Annual Meetup',
      amountPlaceholder: '500',
      expressionPlaceholder: 'Example: 1500 + 350 * 2',
      amountTakenPlaceholder: '5000',
      interestRatePlaceholder: '12',
      profileButton: 'Profile menu',
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
      createAccountBtn: 'ఖాతా సృష్టించండి',
      backToLogin: 'లాగిన్‌కి తిరిగి వెళ్లండి',
      heroEyebrow: 'స్మార్ట్ టీమ్ డబ్బు ట్రాకింగ్',
      heroTitle: 'ప్రతి రూపాయి, టీమ్ మరియు ఈవెంట్‌ను స్పష్టంగా ట్రాక్ చేయండి.',
      heroLead: 'టీమ్లు సృష్టించండి, సభ్యులను జోడించండి, వడ్డీని గణించండి మరియు రోజువారీ ఆర్థిక ట్రాకింగ్ కోసం సేకరణలను నిర్వహించండి.',
      badge1: 'టీమ్ ట్రాకింగ్',
      badge2: 'సేకరణ నివేదికలు',
      badge3: 'కాలిక్యులేటర్ సాధనాలు',
      membersTracked: 'సభ్యులు ట్రాక్స్ చేయబడ్డారు',
      activeTeams: 'చురుకైన టీమ్స్',
      collected: 'సేకరించబడింది',
      explorePaisaVasool: 'పైసా వసూల్‌ను అన్వేషించండి',
      exploreEyebrow: 'ఒక చిన్న పరిచయం',
      exploreTitle: 'డబ్బు నిర్వహణకు అవసరమైన ప్రతిదీ ఒకే చోట.',
      loginPlaceholder: 'వినియోగదారు పేరు నమోదు చేయండి',
      passwordPlaceholder: 'పాస్వర్డ్ నమోదు చేయండి',
      signupUsername: 'వినియోగదారు పేరు',
      signupEmail: 'ఇమెయిల్',
      signupMobile: 'మొబైల్ నంబర్',
      signupPassword: 'పాస్వర్డ్',
      signupConfirmPassword: 'పాస్వర్డ్ నిర్ధారణ',
      signupTeamName: 'టీమ్ పేరు (సాపేక్షం)',
      signupPlaceholderUsername: 'వినియోగదారు పేరు నమోదు చేయండి',
      signupPlaceholderEmail: 'ఇమెయిల్ చిరునామా నమోదు చేయండి',
      signupPlaceholderMobile: 'మొబైల్ నంబర్ నమోదు చేయండి',
      signupPlaceholderPassword: 'పాస్వర్డ్ సృష్టించండి',
      signupPlaceholderConfirmPassword: 'పాస్వర్డ్ నిర్ధారించండి',
      signupPlaceholderTeamName: 'టీమ్ పేరు నమోదు చేయండి',
      navTeam: 'టీమ్',
      navCollection: 'డబ్బు సేకరణ',
      navCalculator: 'కాలిక్యులేటర్',
      navInterest: 'వడ్డీ కాలిక్యులేటర్',
      showProfile: 'ప్రొఫైల్ చూపించు',
      editProfile: 'ప్రొఫైల్ సవరించు',
      settings: 'సెట్టింగ్స్',
      logout: 'లాగ్అవుట్',
      featureTeamTitle: 'ఫీచర్: టీమ్',
      featureTeamDescription: 'కొత్త టీమ్‌ను సృష్టించి ఆ పేరు ద్వారా సభ్యులను జోడించండి.',
      teamNameLabel: 'టీమ్ పేరు',
      teamHeadLabel: 'టీమ్ హెడ్',
      createTeam: 'టీమ్ సృష్టించండి',
      noTeams: 'ఇంకా టీమ్లు లేవు. మీ మొదటి టీమ్‌ను సృష్టించండి.',
      addTeamMember: 'సభ్యుడిని జోడించండి',
      addMember: 'సభ్యుడిని జోడించండి',
      featureCollectionTitle: 'ఫీచర్: డబ్బు సేకరణ',
      featureCollectionDescription: 'ప్రతి సభ్యుడి సహకారాన్ని ట్రాక్ చేసి ఒకే టీమ్‌ను అన్ని కార్యకలాపాల్లో సజావుగా ఉంచండి.',
      selectTeam: 'టీమ్ ఎంచుకోండి',
      event: 'ఈవెంట్',
      memberNameLabel: 'సభ్యుని పేరు',
      amount: 'మొత్తం',
      collectMoney: 'డబ్బు సేకరించండి',
      featureCalculatorTitle: 'ఫీచర్: కాలిక్యులేటర్',
      featureCalculatorDescription: 'రోజువారీ గణనల కోసం ఉపయోగపడే ప్రాక్టికల్ కాలిక్యులేటర్.',
      expression: 'వ్యక్తీకరణ',
      calculate: 'గణించండి',
      result: 'ఫలితం',
      featureInterestTitle: 'ఫీచర్: వడ్డీ మొత్తం కాలిక్యులేటర్',
      featureInterestDescription: 'మొత్తం, తేదీలు మరియు వడ్డీ రేటును ఉపయోగించి లోన్ లేదా ముందుగడుపు వడ్డీని గణించండి.',
      amountTaken: 'తీసుకున్న మొత్తం',
      interestRate: 'వడ్డీ రేటు (%)',
      takenDate: 'తీసుకున్న తేదీ',
      returnDate: 'తిరిగి ఇచ్చే తేదీ',
      calculateInterest: 'వడ్డీ గణించండి',
      interest: 'వడ్డీ',
      totalAmount: 'మొత్తం',
      teamNamePlaceholder: 'ఉదాహరణ: ఈవెంట్ క్రూ',
      teamHeadPlaceholder: 'ఉదాహరణ: రాజు',
      memberNamePlaceholder: 'సభ్యుని పేరు',
      eventPlaceholder: 'ఉదాహరణ: వార్షిక మీటప్',
      amountPlaceholder: '500',
      expressionPlaceholder: 'ఉదాహరణ: 1500 + 350 * 2',
      amountTakenPlaceholder: '5000',
      interestRatePlaceholder: '12',
      profileButton: 'ప్రొఫైల్ మెను',
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
      createAccountBtn: 'अकाउंट बनाएं',
      backToLogin: 'लॉगिन पर वापस जाएं',
      heroEyebrow: 'स्मार्ट टीम मनी ट्रैकिंग',
      heroTitle: 'हर रुपया, टीम और इवेंट को स्पष्ट रूप से ट्रैक करें।',
      heroLead: 'टीम बनाएं, सदस्यों को जोड़ें, ब्याज की गणना करें और दैनिक वित्तीय ट्रैकिंग के लिए संग्रह प्रबंधित करें।',
      badge1: 'टीम ट्रैकिंग',
      badge2: 'संग्रह रिपोर्ट',
      badge3: 'कैलकुलेटर टूल',
      membersTracked: 'सदस्य ट्रैक किए गए',
      activeTeams: 'सक्रिय टीमें',
      collected: 'संग्रहीत',
      explorePaisaVasool: 'पैसा वसूल देखें',
      exploreEyebrow: 'एक त्वरित परिचय',
      exploreTitle: 'पैसों को व्यवस्थित रखने के लिए सब कुछ एक जगह।',
      loginPlaceholder: 'उपयोगकर्ता नाम दर्ज करें',
      passwordPlaceholder: 'पासवर्ड दर्ज करें',
      signupUsername: 'उपयोगकर्ता नाम',
      signupEmail: 'ईमेल',
      signupMobile: 'मोबाइल नंबर',
      signupPassword: 'पासवर्ड',
      signupConfirmPassword: 'पासवर्ड की पुष्टि',
      signupTeamName: 'टीम का नाम (वैकल्पिक)',
      signupPlaceholderUsername: 'उपयोगकर्ता नाम दर्ज करें',
      signupPlaceholderEmail: 'ईमेल पता दर्ज करें',
      signupPlaceholderMobile: 'मोबाइल नंबर दर्ज करें',
      signupPlaceholderPassword: 'पासवर्ड बनाएं',
      signupPlaceholderConfirmPassword: 'पासवर्ड की पुष्टि करें',
      signupPlaceholderTeamName: 'टीम का नाम दर्ज करें',
      navTeam: 'टीम',
      navCollection: 'पैसे की वसूली',
      navCalculator: 'कैलकुलेटर',
      navInterest: 'ब्याज कैलकुलेटर',
      showProfile: 'प्रोफ़ाइल दिखाएँ',
      editProfile: 'प्रोफ़ाइल संपादित करें',
      settings: 'सेटिंग्स',
      logout: 'लॉग आउट',
      featureTeamTitle: 'फीचर: टीम',
      featureTeamDescription: 'नई टीम बनाएं और नाम से सदस्यों को जोड़ें।',
      teamNameLabel: 'टीम का नाम',
      teamHeadLabel: 'टीम हेड',
      createTeam: 'टीम बनाएं',
      noTeams: 'अभी तक कोई टीम नहीं है। अपनी पहली टीम बनाएं।',
      addTeamMember: 'सदस्य जोड़ें',
      addMember: 'सदस्य जोड़ें',
      featureCollectionTitle: 'फीचर: पैसे की वसूली',
      featureCollectionDescription: 'हर सदस्य के सहयोग को ट्रैक करें और एक ही टीम को सभी गतिविधियों से जोड़ें।',
      selectTeam: 'टीम चुनें',
      event: 'इवेंट',
      memberNameLabel: 'सदस्य का नाम',
      amount: 'राशि',
      collectMoney: 'पैसे जमा करें',
      featureCalculatorTitle: 'फीचर: कैल्कुलेटर',
      featureCalculatorDescription: 'दैनिक गणना के लिए एक उपयोगी कैल्कुलेटर।',
      expression: 'अभिव्यक्ति',
      calculate: 'गणना करें',
      result: 'परिणाम',
      featureInterestTitle: 'फीचर: ब्याज राशि कैल्कुलेटर',
      featureInterestDescription: 'राशि, तारीखें और ब्याज दर का उपयोग करके लोन या एडवांस ब्याज की गणना करें।',
      amountTaken: 'ली गई राशि',
      interestRate: 'ब्याज दर (%)',
      takenDate: 'ली गई तिथि',
      returnDate: 'वापसी तिथि',
      calculateInterest: 'ब्याज की गणना करें',
      interest: 'ब्याज',
      totalAmount: 'कुल राशि',
      teamNamePlaceholder: 'उदाहरण: इवेंट क्रू',
      teamHeadPlaceholder: 'उदाहरण: राज',
      memberNamePlaceholder: 'सदस्य का नाम',
      eventPlaceholder: 'उदाहरण: वार्षिक मीटअप',
      amountPlaceholder: '500',
      expressionPlaceholder: 'उदाहरण: 1500 + 350 * 2',
      amountTakenPlaceholder: '5000',
      interestRatePlaceholder: '12',
      profileButton: 'प्रोफ़ाइल मेनू',
    },
  };

  const LanguageFeature = {
    state: {
      currentLanguage: localStorage.getItem('paisaLanguage') || 'en',
    },
    elements: {},

    bind({ languageSelect, dashboardLanguageSelect }) {
      this.elements.languageSelects = [languageSelect, dashboardLanguageSelect].filter(Boolean);
      this.elements.languageSelects.forEach((select) => {
        select.value = this.state.currentLanguage;
        select.addEventListener('change', (event) => {
          this.setLanguage(event.target.value);
        });
      });
      this.applyTranslations();
    },

    setLanguage(lang) {
      this.state.currentLanguage = lang;
      localStorage.setItem('paisaLanguage', lang);
      this.applyTranslations();
    },

    updateViewTitle() {
      const viewTitle = document.getElementById('viewTitle');
      if (!viewTitle) return;
      const activeView = viewTitle.dataset.view || 'team';
      const selected = translations[this.state.currentLanguage] || translations.en;
      const labels = {
        team: selected.navTeam,
        collection: selected.navCollection,
        calculator: selected.navCalculator,
        interest: selected.navInterest,
      };
      viewTitle.textContent = labels[activeView] || selected.navTeam;
    },

    applyTranslations() {
      const currentLanguage = this.state.currentLanguage;
      const selected = translations[currentLanguage] || translations.en;

      document.documentElement.lang = currentLanguage;

      document.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.dataset.i18n;
        if (selected[key] !== undefined) {
          node.textContent = selected[key];
        }
      });

      document.querySelectorAll('[data-placeholder-i18n]').forEach((node) => {
        const key = node.dataset.placeholderI18n;
        if (selected[key] !== undefined) {
          node.placeholder = selected[key];
        }
      });

      const profileButton = document.getElementById('profileButton');
      if (profileButton) {
        profileButton.setAttribute('aria-label', selected.profileButton || 'Profile menu');
      }

      this.updateViewTitle();

      this.elements.languageSelects?.forEach((select) => {
        select.value = currentLanguage;
      });
    },
  };

  window.LanguageFeature = LanguageFeature;
})();
