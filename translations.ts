
import { Category, Difficulty, GameMode, LifelineType } from './types';

export const TRANSLATIONS = {
  ar: {
    // General
    appName: "شرق > غرب",
    back: "عودة",
    next: "التالي",
    continue: "استمرار",
    loading: "جاري التحميل...",
    error: "حدث خطأ",
    by: "by sulaiman alhajri",
    
    // Auth
    loginTitle: "تسجيل الدخول",
    signupTitle: "إنشاء حساب جديد",
    email: "البريد الإلكتروني",
    username: "اسم المستخدم",
    password: "كلمة المرور",
    loginBtn: "دخول",
    signupBtn: "إنشاء حساب",
    noAccount: "ليس لديك حساب؟",
    haveAccount: "لديك حساب بالفعل؟",
    createAccount: "سجل الآن",
    loginSuccess: "تم تسجيل الدخول بنجاح",
    signupSuccess: "تم إنشاء الحساب بنجاح",
    authError: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    emailExists: "البريد الإلكتروني مسجل مسبقاً",
    usernameExists: "اسم المستخدم هذا محجوز",

    // Main Menu
    onlinePlay: "لعب أونلاين",
    onlineDesc: "تحدى أصدقائك عن بعد",
    kidsMode: "شرق غرب للأطفال",
    studentsMode: "شرق غرب للطلاب",
    classicMode: "النسخة الأصلية",
    localTournament: "بطولة محلية",
    mainMenu: "القائمة الرئيسية",

    // Setup
    teamSetup: "إعدادات الفريق",
    teamName: "اسم الفريق",
    teamLogo: "شعار الفريق",
    uploadImg: "رفع صورة خاصة",
    orChooseEmoji: "- أو اختر رمزاً -",
    members: "أعضاء الفريق",
    addMember: "اسم العضو...",
    noMembers: "لم تتم إضافة أعضاء بعد",
    nameExists: "هذا الاسم موجود بالفعل",
    
    // Difficulty
    selectDifficulty: "اختر مستوى التحدي",
    difficulties: {
      [Difficulty.EASY]: "سهل",
      [Difficulty.MEDIUM]: "متوسط",
      [Difficulty.HARD]: "صعب",
      [Difficulty.IMPOSSIBLE]: "مستحيل",
    },

    // Categories
    selectCategory: "اختر القسم",
    categories: {
      [Category.FLAGS]: 'أعلام دول',
      [Category.GENERAL]: 'معلومات عامة',
      [Category.QURAN]: 'قرآن كريم',
      [Category.HADITH]: 'أحاديث نبوية',
      [Category.HOUSE]: 'أشياء بالبيت',
      [Category.CIVILIZATION]: 'حضارة',
      [Category.RIDDLES]: 'ألغاز',
      [Category.DIALECTS]: 'لهجات عربية',
      [Category.SCIENCE]: 'علوم',
      [Category.MATH]: 'رياضيات',
      [Category.FOOTBALL]: 'كرة القدم',
      [Category.CARS]: 'سيارات',
      [Category.ANIMALS]: 'حيوانات',
      [Category.CARTOONS]: 'كرتون',
      [Category.COLORS_SHAPES]: 'ألوان وأشكال',
      [Category.FRUITS_VEG]: 'فواكه وخضروات',
      [Category.HISTORY]: 'تاريخ',
      [Category.GEOGRAPHY]: 'جغرافيا',
      [Category.PHYSICS]: 'فيزياء',
      [Category.ARABIC]: 'لغة عربية',
    },

    // Game
    score: "نقاط",
    timeLeft: "الوقت",
    nextQuestion: "السؤال التالي",
    whoAnswered: "من صاحب الإجابة؟",
    
    // Lifelines
    lifelines: {
      [LifelineType.DOUBLE_CHANCE]: "فرصة مزدوجة",
      [LifelineType.FIFTY_FIFTY]: "حذف إجابتين",
      [LifelineType.CHANGE_QUESTION]: "تغيير السؤال",
    },

    // Online Hub
    onlineHub: "الأونلاين",
    onlineHubDesc: "تحدى أصدقائك في مباريات ودية أو بطولات",
    createFriendly: "إنشاء مباراة ودية",
    createFriendlyDesc: "اختر الأقسام والمستوى بنفسك",
    joinFriendly: "دخول مباراة ودية",
    joinFriendlyDesc: "لديك كود من صديق؟",
    createTournament: "إنشاء بطولة",
    createTournamentDesc: "أقسام عشوائية واسم خاص للبطولة",
    joinTournament: "دخول بطولة",
    joinTournamentDesc: "شارك في بطولة قائمة",
    tournamentName: "اسم البطولة",
    exampleTournament: "مثال: كأس التحدي",
    randomCategoriesNote: "سيتم اختيار 3 أقسام عشوائياً",
    generateCode: "إنشاء كود المباراة",
    enterCode: "أدخل الكود الذي وصلك",
    codeError: "كود غير صحيح",
    copyCode: "نسخ الكود",
    shareCode: "انسخ الكود وأرسله للمنافس",
    successCreate: "تم الإنشاء بنجاح!",
    joinAsHost: "دخول المباراة (كمضيف)",

    // Results
    results: "نتيجة المباراة",
    winner: "الفريق الفائز",
    draw: "تعادل!",
    mvp: "نجم المباراة",
    newGame: "لعبة جديدة",
  },

  en: {
    // General
    appName: "East > West",
    back: "Back",
    next: "Next",
    continue: "Continue",
    loading: "Loading...",
    error: "An error occurred",
    by: "by sulaiman alhajri",

    // Auth
    loginTitle: "Login",
    signupTitle: "Create New Account",
    email: "Email Address",
    username: "Username",
    password: "Password",
    loginBtn: "Login",
    signupBtn: "Sign Up",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    createAccount: "Register Now",
    loginSuccess: "Logged in successfully",
    signupSuccess: "Account created successfully",
    authError: "Invalid email or password",
    emailExists: "Email already registered",
    usernameExists: "Username already taken",

    // Main Menu
    onlinePlay: "Online Play",
    onlineDesc: "Challenge friends remotely",
    kidsMode: "East West Kids",
    studentsMode: "East West Students",
    classicMode: "Original Version",
    localTournament: "Local Tournament",
    mainMenu: "Main Menu",

    // Setup
    teamSetup: "Team Setup",
    teamName: "Team Name",
    teamLogo: "Team Logo",
    uploadImg: "Upload Image",
    orChooseEmoji: "- or choose emoji -",
    members: "Team Members",
    addMember: "Member name...",
    noMembers: "No members added yet",
    nameExists: "Name already exists",

    // Difficulty
    selectDifficulty: "Select Difficulty",
    difficulties: {
      [Difficulty.EASY]: "Easy",
      [Difficulty.MEDIUM]: "Medium",
      [Difficulty.HARD]: "Hard",
      [Difficulty.IMPOSSIBLE]: "Impossible",
    },

    // Categories
    selectCategory: "Select Category",
    categories: {
      [Category.FLAGS]: 'Flags',
      [Category.GENERAL]: 'General Knowledge',
      [Category.QURAN]: 'Quran',
      [Category.HADITH]: 'Hadith',
      [Category.HOUSE]: 'Household Items',
      [Category.CIVILIZATION]: 'Civilization',
      [Category.RIDDLES]: 'Riddles',
      [Category.DIALECTS]: 'Arabic Dialects',
      [Category.SCIENCE]: 'Science',
      [Category.MATH]: 'Mathematics',
      [Category.FOOTBALL]: 'Football',
      [Category.CARS]: 'Cars',
      [Category.ANIMALS]: 'Animals',
      [Category.CARTOONS]: 'Cartoons',
      [Category.COLORS_SHAPES]: 'Colors & Shapes',
      [Category.FRUITS_VEG]: 'Fruits & Vegetables',
      [Category.HISTORY]: 'History',
      [Category.GEOGRAPHY]: 'Geography',
      [Category.PHYSICS]: 'Physics',
      [Category.ARABIC]: 'Arabic Language',
    },

    // Game
    score: "Points",
    timeLeft: "Time",
    nextQuestion: "Next Question",
    whoAnswered: "Who answered?",

    // Lifelines
    lifelines: {
      [LifelineType.DOUBLE_CHANCE]: "Double Chance",
      [LifelineType.FIFTY_FIFTY]: "50:50",
      [LifelineType.CHANGE_QUESTION]: "Change Question",
    },

    // Online Hub
    onlineHub: "Online Hub",
    onlineHubDesc: "Play friendlies or tournaments remotely",
    createFriendly: "Create Friendly",
    createFriendlyDesc: "Choose categories and difficulty",
    joinFriendly: "Join Friendly",
    joinFriendlyDesc: "Have a code from a friend?",
    createTournament: "Create Tournament",
    createTournamentDesc: "Random categories, custom name",
    joinTournament: "Join Tournament",
    joinTournamentDesc: "Join an existing tournament",
    tournamentName: "Tournament Name",
    exampleTournament: "Ex: Grand Cup",
    randomCategoriesNote: "3 Random categories will be selected",
    generateCode: "Generate Code",
    enterCode: "Enter Game Code",
    codeError: "Invalid Code",
    copyCode: "Copy Code",
    shareCode: "Copy this code and send it to your friend",
    successCreate: "Created Successfully!",
    joinAsHost: "Enter Game (As Host)",

    // Results
    results: "Match Results",
    winner: "Winner",
    draw: "Draw!",
    mvp: "MVP",
    newGame: "New Game",
  }
};