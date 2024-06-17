// HTML5 App for Phonetic typing and converting to some Indian Languages
// Written by Amarnath S, Bengaluru, India, November 2020
// Please report issues to amarabharati.samskrita@gmail.com
// Updated December 2022
// Further updated January 2024.
// Included Zero width joiner with ^ character.
// Included Zero width non joiner with ^^ characters. 31 Jan 2024
// Included RRA, LLLa and Pollu characters in Kannada, 3 Feb 2024
// Updated to fix words like paaraar^^thyam, 14 June 2024
// Updated the UI based on Sri Srini Amble's suggestions, 17 June 2024
// Bug - still not properly handling anaMt^^naag
// TODO: To fix issues in Assamese, Bengali and Malayalam caret ^ handling

(function () {
  "option strict";

  let consonants;
  let vowels;
  let kaagunita;
  let numbers;
  let viraama;
  let anusvaara;
  let visarga;
  let avagraha;
  let danda;
  let doubleDanda;
  let chandraBindu;

  let inputPassage;
  let outputPassage;
  let passage;

  let inputTextPanel;
  let outputTextPanel;

  let sampleGenericPassage;

  let language;
  let optionLang;
  //let numbering;

  let latinNumbers = new Map();

  let bnTrans;
  let bnCopyInpText;
  let bnCopyOutText;

  const regex1 = /aa/g;
  const regex2 = /ee/g;
  const regex3 = /oo/g;
  const regex4 = /kh/g;
  const regex5 = /gh/g;
  const regex6 = /ch/g;
  const regex7 = /jh/g;
  const regex8 = /ph/g;
  const regex9 = /bh/g;
  const regex10 = /sh/g;
  const regex11 = /Ch/g;
  const regex12 = /ai/g;
  const regex13 = /au/g;
  const regex14 = /ou/g;
  const regex15 = /Th/g;
  const regex16 = /Dh/g;
  const regex17 = /th/g;
  const regex18 = /dh/g;
  const regex19 = /Sh/g;
  const regex20 = /~g/g;
  const regex21 = /~j/g;
  const regex22 = /Ru/g;
  const regex23 = /RU/g;
  const regex24 = /eu/g;
  const regex25 = /~n/g;
  const regex26 = /~m/g;
  // The main regex in this application is this - regex27
  const regex27 =
    /[bcdfghjklmnpqrstvwxyz~&|/:;,.?@!#$%><[(){}=_\'"`+\-\^\]\\]{0,}[aeiou^]{0,}/gi;
  const regex28 = /zh/g;
  const regex29 = /~M/g;
  const regex30 = /rx/g;
  const regex31 = /~n/g; // For Gurmukhi Addak
  const regex32 = /Lx/g;
  const regex33 = /Rx/g;
  const regex34 = /Zx/g;

  let caret = "\u005E";
  const zwj = "\u200D"; // zero width joiner -> https://en.wikipedia.org/wiki/Zero-width_joiner
  const zwnj = "\u200C"; // zero width non joiner

  window.onload = init;

  function init() {
    setupKannadaMaps();
    setupDevanagariMaps();
    setupTeluguMaps();
    setupBengaliMaps();
    setupOdiaMaps();
    setupTamilMaps();
    setupGujaratiMaps();
    setupGurmukhiMaps();
    setupMalayalamMaps();
    danda = devanagariDanda;
    doubleDanda = devanagariDoubleDanda;

    passage = "";

    sampleGenericPassage =
      ' namaskAra suprabhAta shubhadina shubharaatri paaraar^thyam paaraar^thyaM paaraarthyaM \n shree kRuShNa gOviMda harE muraarE \n shree raama jayaM   \n pitRUn shreekRuShNakarNaamRutaM123 1 2 3 5.676 980 \n ka kha ga gha ~ga    cha Cha ja Ja ~ja    Ta Tha Da Dha Na    ta tha da dha na Zxa    pa pha ba bha ma \n ya ra rxa la va sha Sha sa ha La Lxa \n rxa rxaa rxi rxee rxu rxoo rxe rxE rxai rxo rxO rxou \n Lxa Lxaa Lxi Lxee Lxu Lxoo Lxe LxE Lxai Lxo LxO Lxou \n maar^kaLxitti~ggaL madinirxainda paarxkaDaluL payattuyinrxa puLLiZxavaay keeNDaanai \n madiniRxainda paaRxkaDaluL payattuyinRxa \n . , ! @ # $ % ^ ( ) < > { } [ ] / " ? | = - _ ` ~ + \n ba! baa@ bi# bee$ bu% boo( \n tatO&rghya tatO&rghyE pitRu pitRUNaaM \n prahRuShTa vadanO rAjA tatO&rghyamupahArayat | \n sa rAj~jaH pratigRuhyArghyaM shaastra dRuShTEna karmaNaa || \n a aa i ee u oo Ru RU lRu e E ai o O ou aM am aH \n ka kaa ki kee ku koo kRu kRU klRu klRU ke kE kai ko kO kou kaM kam kaH \n ma maa mi mee mu moo mRu mRU mlRu mlRU me mE mai mo mO mou maM mam maH \n vikramaarkasiMhaasanakathaa vikramaar^kasiMhaasanakathaa  vikramaarkasim^haasanakathaa vikramaarkasim^^haasanakathaa \n rAjkumAr rAj^kumAr rAj^^kumAr \n udayakumaar kalyaaN^^kumaar viShNuvardhan raajaashaMkar narasiMharaaju baalakRuShNa shreenaath aMbareeSh vajramuni anaMtanaag shaMkar^^naag dvaarakeesh raajEsh \n sAPTwEr sAPT^wEr sAPT^^wEr \n sUrya sUr^ya sUr^^ya';

    //sampleGenericPassage = "r^ga";

    //sampleGenericPassage = "yArghya  r^ga r^^ga sAPT^wEr "; // Bug with sAPT^wEr

    //sampleGenericPassage = "r^thya r^thyu r^ku T^wEr pT^wEr TwEr sAPT^wEr sAPT^^wEr"; // "paaraar^thyam";

    //sampleGenericPassage = "pT^wEr";

    language = "Kannada";
    numbering = "latin";

    latinNumbers.set("0", "\u0030");
    latinNumbers.set("1", "\u0031");
    latinNumbers.set("2", "\u0032");
    latinNumbers.set("3", "\u0033");
    latinNumbers.set("4", "\u0034");
    latinNumbers.set("5", "\u0035");
    latinNumbers.set("6", "\u0036");
    latinNumbers.set("7", "\u0037");
    latinNumbers.set("8", "\u0038");
    latinNumbers.set("9", "\u0039");

    document.getElementById("inputEnglish").value = sampleGenericPassage;

    bnTrans = document.getElementById("transliterate");
    bnTrans.addEventListener("click", transliteratePassage, false);

    optionLang = document.getElementById("inpLang");
    optionLang.addEventListener("change", handleOption, false);

    bnCopyInpText = document.getElementById("copyInpText");
    bnCopyInpText.addEventListener("click", copyInputText, false);

    bnCopyOutText = document.getElementById("copyOutText");
    bnCopyOutText.addEventListener("click", copyOutputText, false);

    inputTextPanel = document.getElementById("inputEnglish");
    inputPassage = inputTextPanel.value;

    selectExample = document.getElementById("examples");
    selectExample.addEventListener("change", chooseExample, false);

    optionLang.value = "kannada";
    outputTextPanel = document.getElementById("outputText");
    handleOption();
  }

  function chooseExample() {
    switch (this.value) {
      case "assamese":
        this.passage =
          " a' mor aaponaar desh \n a' mor cikuni desh \n enekhan shuvala enekhan suphala \n enekhan maramar desh  \n \n a' mor sureeyaa maat  \n asamar suvadee maat \n pRuthiweer ka' to bicaari janamaTo \n nopowaa karileo paat \n \n a' mor opaja Thaai \n a' mor asamee aa i \n chaai l O~M ebaar mukhani tomaar \n he~Mpaah mor palowaa naai \n\n\n moi akhomia bhal pau";
        optionLang.value = "assamese";
        language = "Assamese";
        break;
      case "bengali":
        this.passage =
          " vande maataram \n sujalaaM suphalaaM malayajasheetalaam \n shasya shaamalaaM maataram \n vande maataram \n \n shubhra jyot^snaa pulakita yaamineem \n phulla kusumita drumadalashobhineem \n suhaasumeeM sumadhurabhaashineem \n sukhadaaM baradaaM maataram \n vande maataram";
        optionLang.value = "bengali";
        language = "Bengali";
        break;
      case "devanagari":
        this.passage =
          "      praarthanaa \n \n yaM brahmaa varuNEndra rudra marutaH stunvanti divyaiH stavaiH | \n vedaissaa~ggapadakramOpaniShadairgaayanti yaM saamagaaH | \n dhyaanaavasthita tadgatEna manasaa pashyanti yaM yOginaH | \n yasyaaMtaM na vidussuraaH suragaNaaH dEvaaya tasmai namaH || 1 || \n \n namastE satE tE jagatkaaraNaaya \n namastE chitE sarva lOkaashrayaaya | \n namo&dvaita tattvaaya mukti pradaaya \n namO brahmaNE vyaapiNE shaashvataaya || 2 ||\n \n tvamEkaM sharaNyaM tvamEkaM varENyaM \n tvamEkaM jagatpaalakaM svaprakaasham | \n tvamEkaM jagatkartRu maatRu prahatRu \n tvamEkaM paraM nishchalaM nirvikalpaM || 3 || \n \n vayaM tvaaM smaraamO vayaM tvaam bhajaamaH \n vayaM tvaaM jagatsaakShi roopaM namaamaH | \n sadEkaM nidhaanaM niraalambameeshaM \n bhavaambOdhi pOtaM sharaNyaM vrajaamaH || 4 || \n \n yO&ntaH pravishya mamavaachamimaaM prasuptaaM | \n sanjeeva yatyakhila shakti dharasvadhaamnaa | \n anyaaMshcha hasta charaNa shravaNa tvagaadeen | \n praaNaannamO bhagavatE puruShaaya tubhyaM || 5 || \n \n tvamEva maataa cha pitaa tvamEva \n tvamEva bandhushcha sakhaa tvamEva | \n tvamEva vidyaa draviNaM tvamEva \n tvamEva sarvaM mama dEvadEva || 6 || \n \n sarvE&pi sukhinassantu sarvE saMtu niraamayaaH \n sarvE bhadraaNi pashyantu maa kashchit duHkha bhaagbhavEt || 7 || \n \n || ma~ggalamastu ||";
        optionLang.value = "devanagari";
        language = "Devanagari";
        break;
      case "kannada1":
        this.passage =
          "  shree puraMdaradaasara jagadOddhaarana \n \n jagadOddhArana ADisidaLeshOde || \n \n jagadOddhArana maganeMdu tiLiyuta | \n suguNAMta raMganA ADisidaLeshOde || \n \n nigamakE silukada agaNita mahimana | \n magugaLa mANikyana ADisidaLeshOde || \n \n aNOraNIyana mahatO mahIyana | \n apramEyanana ADisidaLeshOde || \n \n parama puruShana paravAsudEvana |\n puraMdara viThalana ADisidaLeshOde ||";
        optionLang.value = "kannada";
        language = "Kannada";
        break;
      case "kannada2":
        this.passage =
          "    shree kanakadaasara kRuti - tanu ninnadu \n \n tanu ninnadu jeevana ninnadu raMgaa | \n anudinadali baahO sukha duHkha ninnadayya ||  || \n \n savinuDi vEda puraaNa shaastraMgaLa kivigoTTu kELuva kathe ninnadu | \n navamOhanaaMgiyara roopava kaNNiMda eveyikkade nODO aa nOTa ninnadayya || 1 || \n \n oDagooDi gaMdha kastoori parimaLaMgaLa biDade lEpisikoMbuvudu ninnadu | \n ShaDurasadannakke nalidaaDuva jihve kaDuruchigoMDare aa ruchi ninnadayya || 2 || \n \n maayaapaashada baleyoLage silukiruva kaaya paMchEMdriyagaLu ninnavu | \n maayaarahita kaagineleyaadikEshava raaya neenillade nararu svataMtrarE || 3 ||";
        optionLang.value = "kannada";
        language = "Kannada";
        break;
      case "kannada3":
        this.passage =
          "    Daa || guMDappanavara maMkutimmana kagga \n \n shree viShNu vishvaadimoola maayaalOla | \n dEva sarvEsha parabommaneMdu janaM || \n aavudanu kaaNadoDamaLtiyiM naMbihudO | \n aa vichitrake namiso - maMkutimma || 1 || \n\n jeeva jaDaroopa prapaMchavanadaavudO | \n aavarisikoMDumoLaneredumihudaMte || \n bhaavakoLapaDadaMte aLategaLavaDadaMte | \n aa vishEShake maNiyo - maMkutimma || 2 || \n \n ihudO illavO tiLiyagoDadoMdu vastu nija | \n mahimeyiM jagavaagi jeeva vEShadali || \n viharipudadoLLiteMbudu nisadavaadoDaa | \n gahana tattvake sharaNo - maMkutimma || 3 ||";

        optionLang.value = "kannada";
        language = "Kannada";
        break;
      case "gujarati":
        this.passage =
          "   vaiShNava jana to \n \n vaiShNava jana tO tEne kahiye \n  je peeDa paraaI jaaNe re \n para duHkhe upakaara kare to ye \n   mana abhimaana na aaNe re ||  || \n \n sakaLa lokamaaM sahune vaMde \n   niMdaa na kare kenI re \n vaaca kaaCha mana nishchala raakhe \n   dhana dhana jananI tenee re || 1 || \n \n samadRuShTi ne tRuShNaa tyaagee \n   para tree jene maata re \n  jihvaa thakee asatya na bole \n    paradhana nava jhaale haatha re || 2 ||\n \n moha maayaa vyaape nahi jene \n    dhRuDha vairaagya jenaa manamaaM re \n raama naama shu taaLee re laagee \n   sakaLa teeratha tenaa tanamaaM re || 3 || \n \n vaNa lobhee ne kapaTa rahita Che \n    kaama krodha nivaaryaaM re \n  bhaNe narasaiyo tenuM darshana karataaM \n    kuLa ekotera taaryaa re || 4 ||";
        optionLang.value = "gujarati";
        language = "Gujarati";
        break;
      case "gurumukhi":
        this.passage =
          " deh sivaa baru mohi eehai subha karmana te kabahU~m na TareM || \n na DaroM ari so jab jaabi laroM nishchai kari apuni jeet karoM || \n aru sikh ho aapne hee man kou iha laalach ha u gun ta u ucharoM || \n jab aav kee a udh nidaan banai ati hee ran mai tab joojh maroM ||";
        optionLang.value = "gurmukhi";
        language = "Gurmukhi";
        break;
      case "malayalam":
        this.passage =
          " akhilaaNDa maNDalamaNiyicchorukki \n atinuLLilaananda deepaM koLutti \n paramaaNu poruLeeluM sphuraNamaay minnuM \n parama prakashamE sharaNaM nee nityaM \n \n suragOLa lakSha~g~gaLaNiyiTTu nir^thi \n aavikala souhruda bandhaM pular^thi \n atinokkeyadhara sootramiNakki \n kuTikoLLuM satyamE sharNaM neeyennuM \n \n duritangaL^ koothadumulakathil ninte \n paripoor^NNa tejassu viLayaaTikkaNmon^ \n oru jaati oru daivamEvam \n parishuddha vEdantaM saphalamaay teeraan^ ";
        this.passage =
          " va~jchibhoomipatE ciraM \n   sa~jjitaabhaM jayikkENaM \n dEvadEvan^ bhavaaneNuM \n   dEhasaukhyaM vaLar^ttENaM \n \n va~jchibhoomipatE ciraM \n tvaccaritamennuM bhoomau \n     viSrutamaayi viLa~g~ggENaM \n \n va~jchibhoomipatE ciraM \n mar^tyamanamEtuM bhavaal^ \n pattanamaayi bhavikkENaM \n \n va~jchibhoomipatE ciraM \n taavakamaaM kulaM mEnmEl^ \n     shreevaLar^nnullasikkENaM \n \n va~jchibhoomipatE ciraM \n maalakaRRi ciraM \n prajaapaalanaM ceytaruLENaM \n \n va~jchibhoomipatE ciraM \n   sa~jjitaabhaM jayikkENaM";
        optionLang.value = "malayalam";
        language = "Malayalam";
        break;
      case "odia":
        this.passage =
          " bande utkaLa jananee \n    chaaru haasyamaYI chaaru bhaaShamaYI \n jananee jananee jananee || \n \n poota payodhi bidhauta shareeraa \n    taaLatamaaLa sushobhita teeraa \n shubhra taTineekooLa sheekara sameeraa \n    jananee jananee jananee || 1 || \n \n ghana banabhoomi raajita a~gge \n    neeLa bhoodaramaaLaa saaje tara~gge \n  kaLa kaLa mukharita caaru biha~gge \n    jananee jananee jananee || 2 || \n \n sundarashaaLee sushobhita kShEtraa \n    j~jaanabijj~jaana pradarshita netraa \n yogee RuShigaNa uTaja pabitraa \n    jananee jananee jananee || 3 || \n \n sundara mandira maNDita deshaa \n    chaarukaLaabaLee shobhita beshaa \n puNya teerthacaYa poorNNa pradeshaa \n    jananee jananee jananee || 4 || \n \n utkaLa shoorabeera darpita gehaa \n    arikuLa shoNita carccita dehaa \n bishvabhoomaNDaLa kRutabara snehaa \n    jananee jananee jananee || 5 || \n \n kabikuLamauLi sunandana bandyaa \n    bhubanabighoShita keertti anindyaa \n dhanye puNye cirasharaNye \n    jananee jananee jananee || 6 ||";
        optionLang.value = "odia";
        language = "Odia";
        break;
      case "tamil":
        this.passage =
          "  tiruppAvai - shree aaNDaaL \n \n maargazhit thi~ggaL madhi~niRai~nda ~nannaaLaal \n ~neeraaDap pOduveer pOduminO ~nErizhaiyeer | \n cheermalkum aayppaaDich chelvach chiRumeergaaL \n koorvEl koDu~ndhozhilan ~na~ndagOpan kumaran || \n eraar~nda kaNNi yachOdai iLa~jchi~ggam \n kaarmEnich che~ggaN kadirmadhiyam pOlmukattaan || \n ~naaraayaNanE ~namakkE paRai taruvaan \n paarOr pugazhap paDi~ndElO rembaavaay || 1 || \n\n vaiyaththu vaazhveergaaL ~naamum ~nampaavaikkuch \n cheyyu~g kirichaigaL kELeerO | \n paaRkaDaluL paiyat thuyinRa paramanaDi paaDi \n ~neyyuNNOm paaluNNOm ~naaTkaalE ~neeraaDi ||  \n maiyiTTu ezhudhOm malariTTu ~naam muDiyOm \n cheyyaadana cheyyOm teekkuRaLai chenROdOm | \n aiyamum pichchaiyum aa~ndanaiyum kai kaaTTi \n uyyumaa ReNNi uga~ndElO rempaavaay || 2 ||";
        // Thanks to my friend Sri Sudarsanan for pointing out mistakes in the sample Tamil text.
        optionLang.value = "tamil";
        language = "Tamil";
        break;
      case "telugu":
        this.passage =
          "  kaligenide naaku - aNNamayya keertanamu \n \n kaligenide naaku kaivalyamu \n   tolutanevvariki dorakanidi || \n \n jayapuruShOttama jaya peetaaMbara \n   jayajaya karuNaajalanidhi | \n daya yerxaMga nE dharmamu nerxaga naa \n   kriya yidi needivyakeertanamE || \n \n SaraNamu gOviMda SaraNamu kESava \n   SaraNu SaraNu Sreejanaardhana | \n parama merxaMganu bhakti yerxaMganu \n   niratamu naagati needaasyamE || \n \n namO naaraayaNaa namO lakShmeepati \n   namaH puMDareekanayanaa | \n amita SreevEMkaTaadhipa yide naa \n   kramamellanu neekaiMkaryamE || ";
        optionLang.value = "telugu";
        language = "Telugu";
        break;
      default:
        //console.log("Coming to default");
        alert("Example Input not recognised: " + this.value);
        return;
    }
    inputTextPanel.value = this.passage;
    handleOption();
  }

  function handleOption() {
    if (optionLang.value === "kannada") {
      language = "Kannada";
      vowels = kannadaVowels;
      consonants = kannadaConsonants;
      kaagunita = kannadaKaagunita;
      numbers = kannadaNumbers;
      anusvaara = kannadaAnusvaara;
      visarga = kannadaVisarga;
      viraama = kannadaViraama;
      avagraha = kannadaAvagraha;
      chandraBindu = kannadaChandraBindu;
    } else if (optionLang.value === "devanagari") {
      language = "Devanagari";
      vowels = devanagariVowels;
      consonants = devanagariConsonants;
      kaagunita = devanagariKaagunita;
      numbers = devanagariNumbers;
      anusvaara = devanagariAnusvaara;
      visarga = devanagariVisarga;
      viraama = devanagariViraama;
      avagraha = devanagariAvagraha;
      chandraBindu = devanagariChandraBindu;
    } else if (optionLang.value === "telugu") {
      language = "Telugu";
      vowels = teluguVowels;
      consonants = teluguConsonants;
      kaagunita = teluguKaagunita;
      numbers = teluguNumbers;
      anusvaara = teluguAnusvaara;
      visarga = teluguVisarga;
      viraama = teluguViraama;
      avagraha = teluguAvagraha;
      chandraBindu = teluguChandraBindu;
    } else if (optionLang.value === "bengali") {
      language = "Bengali";
      vowels = bengaliVowels;
      consonants = bengaliConsonants;
      kaagunita = bengaliKaagunita;
      numbers = bengaliNumbers;
      anusvaara = bengaliAnusvaara;
      visarga = bengaliVisarga;
      viraama = bengaliViraama;
      avagraha = bengaliAvagraha;
      chandraBindu = bengaliChandraBindu;
      bengaliConsonants.set("r", "\u09B0");
      bengaliConsonants.set("x", "\u09B0");
      bengaliConsonants.set("v", "\u09AC");
      bengaliConsonants.set("w", "\u09AC");
    } else if (optionLang.value === "assamese") {
      language = "Assamese";
      vowels = bengaliVowels;
      consonants = bengaliConsonants;
      kaagunita = bengaliKaagunita;
      numbers = bengaliNumbers;
      anusvaara = bengaliAnusvaara;
      visarga = bengaliVisarga;
      viraama = bengaliViraama;
      avagraha = bengaliAvagraha;
      chandraBindu = bengaliChandraBindu;

      // The ra, va are different in Assamese and Bengali
      bengaliConsonants.set("r", assameseRa);
      bengaliConsonants.set("x", assameseRa);
      bengaliConsonants.set("v", assameseVa);
      bengaliConsonants.set("w", assameseVa);
    } else if (optionLang.value === "odia") {
      language = "Odia";
      vowels = odiaVowels;
      consonants = odiaConsonants;
      kaagunita = odiaKaagunita;
      numbers = odiaNumbers;
      anusvaara = odiaAnusvaara;
      visarga = odiaVisarga;
      viraama = odiaViraama;
      avagraha = odiaAvagraha;
      chandraBindu = odiaChandraBindu;
    } else if (optionLang.value === "tamil") {
      language = "Tamil";
      vowels = tamilVowels;
      consonants = tamilConsonants;
      kaagunita = tamilKaagunita;
      numbers = tamilNumbers;
      anusvaara = tamilAnusvaara;
      visarga = tamilVisarga;
      viraama = tamilViraama;
      avagraha = tamilAvagraha;
      chandraBindu = tamilChandraBindu;
    } else if (optionLang.value === "gujarati") {
      language = "Gujarati";
      vowels = gujaratiVowels;
      consonants = gujaratiConsonants;
      kaagunita = gujaratiKaagunita;
      numbers = gujaratiNumbers;
      anusvaara = gujaratiAnusvaara;
      visarga = gujaratiVisarga;
      viraama = gujaratiViraama;
      avagraha = gujaratiAvagraha;
      chandraBindu = gujaratiChandraBindu;
    } else if (optionLang.value === "gurmukhi") {
      language = "Gurmukhi";
      vowels = gurmukhiVowels;
      consonants = gurmukhiConsonants;
      kaagunita = gurmukhiKaagunita;
      numbers = gurmukhiNumbers;
      anusvaara = gurmukhiAnusvaara;
      visarga = gurmukhiVisarga;
      viraama = gurmukhiViraama;
      avagraha = gurmukhiAvagraha;
      chandraBindu = gurmukhiChandraBindu;
    } else if (optionLang.value === "malayalam") {
      language = "Malayalam";
      vowels = malayalamVowels;
      consonants = malayalamConsonants;
      kaagunita = malayalamKaagunita;
      numbers = malayalamNumbers;
      anusvaara = malayalamAnusvaara;
      visarga = malayalamVisarga;
      viraama = malayalamViraama;
      avagraha = malayalamAvagraha;
      chandraBindu = malayalamChandraBindu;
    }
    transliteratePassage();
    document.getElementById("outputTitle").innerHTML = language + " Output";
  }

  function transliteratePassage() {
    inputPassage = document.getElementById("inputEnglish").value;
    outputPassage = "";
    let lines = inputPassage.split("\n");

    for (let i = 0; i < lines.length; ++i) {
      let line = lines[i];
      let strgParts = line.split(" ");
      //console.log("StrgParts ----", strgParts);

      for (let j = 0; j < strgParts.length; ++j) {
        outputPassage += SplitIntoParts(strgParts[j]);
        outputPassage += " ";
      }
      outputPassage += "\n";
    }
    outputTextPanel.value = outputPassage;
  }

  function SplitIntoParts(strg) {
    // First find the numbers in the string
    let splitNos = strg.split(/(\d+)/);
    //let splitNos = strg.split("(?<=\\D)(?=\\d+\\b)");

    let transString = "";

    for (let j = 0; j < splitNos.length; ++j) {
      //let isnum = /^\d+\xd4/.test(splitNos[j]); // Check for number
      let isnum = /\d/.test(splitNos[j]); // Check for number

      if (isnum) {
        // Handling of numbers
        let num = splitNos[j];
        for (let i = 0; i < num.length; ++i) {
          let no = num[i].toString();
          if (numbers.has(no)) {
            transString += numbers.get(no);
          } else {
            transString += no;
          }
        }
      } else {
        // Handling of non-numbers
        let splitParts = splitNos[j].match(regex27);
        //console.log(splitParts);

        for (let i = 0; i < splitParts.length - 1; ++i) {
          let isLastPart = i === splitParts.length - 2;
          let isFirstPart = i === 0;
          transString += transliterateEachPart(
            splitParts[i],
            isFirstPart,
            isLastPart
          );
        }
      }
    }
    return transString;
  }

  // Function to handle updated part of Length 1, like "H", "a", "|"
  function handlePartOfLength1(updatedPart, isFirstPart, isLastPart, result) {
    //console.log("Coming here Part 1", updatedPart, isFirstPart);
    if (updatedPart[0] == "R" && isFirstPart) {
      result += vowels.get("Ru");
    } else if (vowels.has(updatedPart[0])) {
      result += vowels.get(updatedPart[0]);
    } else if (consonants.has(updatedPart[0])) {
      if (
        (language === "Bengali" ||
          language === "Assamese" ||
          language === "Odia" ||
          language === "Gujarati" ||
          language === "Gurmukhi") &&
        isLastPart
      ) {
        // For Assamese, Bengali, Odia, Gujarati, Gurmukhi languages,
        //  the last consonant has an 'a' ending
        result += consonants.get(updatedPart[0]);
      } else {
        result += consonants.get(updatedPart[0]) + viraama;
      }
    } else if (updatedPart === "H") {
      result += visarga;
    } else if (updatedPart === "M") {
      result += anusvaara;
    } else if (updatedPart === "\xd2") {
      result += danda;
    } else if (updatedPart === "\xda") {
      if (language === "Gurmukhi") {
        result += gurmukhiTippi;
      }
    } else if (updatedPart === "\xdb") {
      if (language === "Gurmukhi") {
        result += gurmukhiAddak;
      }
    } else if (updatedPart === "\xdc") {
      result += chandraBindu;
    } else {
      result += updatedPart;
    }
    return result;
  }

  // Function to handle updated part of Length 2, like "ta", "da", "ru", "Ba"
  function handlePartOfLength2(updatedPart, isFirstPart, result) {
    //console.log("Coming here Part 2", updatedPart, isFirstPart);

    if (language === "Malayalam") {
      if (updatedPart[1] === "^") {
        // Handle the Chillus
        if (updatedPart[0] === "N") {
          result += malayalamChilluNN;
        } else if (updatedPart[0] === "n") {
          result += malayalamChilluN;
        } else if (updatedPart[0] === "r") {
          result += malayalamChilluRR;
        } else if (updatedPart[0] === "l") {
          result += malayalamChilluL;
        } else if (updatedPart[0] === "L") {
          result += malayalamChilluLL;
        } else {
          result += malayalamChilluK;
        }
        return result;
      } else if (consonants.has(updatedPart[0]) && updatedPart[1] === "R") {
        result +=
          consonants.get(updatedPart[0]) + kaagunita.get(updatedPart[1]);
        return result;
      }
    }

    if (language === "Bengali") {
      if (updatedPart[0] === "t" && updatedPart[1] === "^") {
        result += bengaliKhandaTa;
        return result;
      }
    }

    if (updatedPart[0] === "\xda" || updatedPart[0] === "\xdb") {
      // For Gurmukhi language and Tamil language
      if (updatedPart[0] === "\xda") {
        if (language === "Gurmukhi") {
          result += gurmukhiTippi;
        }
        if (language === "Tamil") {
          result += consonants.get("\xda");
          if (consonants.has(updatedPart[1])) {
            result += viraama + consonants.get(updatedPart[1]);
          } else if (kaagunita.has(updatedPart[1])) {
            result += kaagunita.get(updatedPart[1]);
          }
          return result;
        }
      } else if (updatedPart[0] === "\xdb") {
        if (language === "Gurmukhi") {
          result += gurmukhiAddak;
        }
      }
      if (updatedPart[1] !== "a") {
        result += kaagunita.get(updatedPart[1]);
      }
    } else if (consonants.has(updatedPart[0])) {
      if (updatedPart[1] === "a") {
        result += consonants.get(updatedPart[0]);
      } else if (consonants.has(updatedPart[1])) {
        result +=
          consonants.get(updatedPart[0]) +
          viraama +
          consonants.get(updatedPart[1]) +
          viraama;
      } else {
        result +=
          consonants.get(updatedPart[0]) + kaagunita.get(updatedPart[1]);
      }
    } else if (updatedPart[0] === "|" && updatedPart[1] === "|") {
      result += doubleDanda;
    } else if (vowels.has(updatedPart[0])) {
      //console.log("Should not come here Part 2");
    } else if (updatedPart[0] === "\xdc") {
      result += chandraBindu;
      if (vowels.has(updatedPart[1])) {
        result += vowels.get(updatedPart[1]);
      } else if (consonants.has(updatedPart[1])) {
        result += consonants.get(updatedPart[1]) + viraama;
      }
    } else {
      console.log("Should not come here also Part 2");
    }
    return result;
  }

  // Function to handle updated part of Length 3, like "tri", "gge", "gra"
  function handlePartOfLength3(updatedPart, isFirstPart, result) {
    //console.log("Coming here Part 3", updatedPart, isFirstPart);

    if (language === "Gurmukhi") {
      // Identify two consonants which come in pairs and replace
      // with Addak and one consonant

      // Match two repeated consonants
      let regex = /([bcdfghjklmnpqrstvwxyz])\1+/i;
      let updatedPart1 = updatedPart.match(regex);
      if (updatedPart1 !== null && updatedPart1.length === 2) {
        result += gurmukhiAddak + consonants.get(updatedPart1[0][0]);
        if (kaagunita.has(updatedPart[2])) {
          result += kaagunita.get(updatedPart[2]);
        }
        return result;
      }
    }

    // First handle the special cases of the first letter of this string
    if (
      updatedPart[0] === "M" ||
      updatedPart[0] === "&" ||
      updatedPart[0] === "H" ||
      updatedPart[0] === "\xda" ||
      updatedPart[0] === "\xdb" ||
      updatedPart[0] === "\xdc"
    ) {
      if (updatedPart[0] === "M") {
        result += anusvaara;
      } else if (updatedPart[0] === "&") {
        result += avagraha;
      } else if (updatedPart[0] === "H") {
        result += visarga;
      } else if (updatedPart[0] === "\xda") {
        // ~n
        if (language === "Gurmukhi") {
          result += gurmukhiTippi;
        }
        if (language === "Tamil") {
          // Part starts with ~n
          result += consonants.get("\xda");
          if (consonants.has(updatedPart[1])) {
            result += viraama + consonants.get(updatedPart[1]);
          } else if (kaagunita.has(updatedPart[1])) {
            result += kaagunita.get(updatedPart[1]);
          }
          if (consonants.has(updatedPart[2])) {
            result += viraama + consonants.get(updatedPart[2]);
          } else if (kaagunita.has(updatedPart[2])) {
            result += kaagunita.get(updatedPart[2]);
          }
          return result;
        }
      } else if (updatedPart[0] === "\xdb") {
        // ~m
        if (language === "Gurmukhi") {
          result += gurmukhiAddak;
        }
      } else if (updatedPart[0] === "\xdc") {
        result += chandraBindu;
      }
      if (consonants.has(updatedPart[1])) {
        if (updatedPart[2] === "a") {
          result += consonants.get(updatedPart[1]);
        } else {
          result +=
            consonants.get(updatedPart[1]) + kaagunita.get(updatedPart[2]);
        }
      } else {
        console.log("Vowel in updatedPart[1] - Case 3 - to handle");
      }
    } else if (updatedPart[0] === "z" && isFirstPart) {
      result +=
        vowels.get("Ru") +
        consonants.get(updatedPart[1]) +
        kaagunita.get(updatedPart[2]);
    } else if (
      consonants.has(updatedPart[0]) &&
      consonants.has(updatedPart[1])
    ) {
      if (updatedPart[2] === "a") {
        result +=
          consonants.get(updatedPart[0]) +
          viraama +
          consonants.get(updatedPart[1]);
      } else if (consonants.has(updatedPart[2])) {
        result +=
          consonants.get(updatedPart[0]) +
          viraama +
          consonants.get(updatedPart[1]) +
          viraama +
          consonants.get(updatedPart[2]) +
          viraama;
      } else {
        result +=
          consonants.get(updatedPart[0]) +
          viraama +
          consonants.get(updatedPart[1]) +
          kaagunita.get(updatedPart[2]);
      }
    } else if (consonants.has(updatedPart[0]) && vowels.has(updatedPart[1])) {
      if (updatedPart[1] === "a") {
        result += consonants.get(updatedPart[0]) + vowels.get(updatedPart[2]);
      } else {
        result +=
          consonants.get(updatedPart[0]) +
          kaagunita.get(updatedPart[1]) +
          vowels.get(updatedPart[2]);
      }
    }
    return result;
  }

  function handlePartOfLengthGreaterThan3(updatedPart, result) {
    //console.log("Coming here Part 4", updatedPart);
    if (
      updatedPart[0] === "M" ||
      updatedPart[0] === "&" ||
      updatedPart[0] === "H" ||
      updatedPart[0] === "\xda" ||
      updatedPart[0] === "\xdb"
    ) {
      if (updatedPart[0] === "M") {
        result += anusvaara;
      } else if (updatedPart[0] === "&") {
        result += avagraha;
      } else if (updatedPart[0] === "H") {
        result += visarga;
      } else if (updatedPart[0] === "\xda") {
        // ~n
        if (language === "Gurmukhi") {
          result += gurmukhiTippi;
        }
      } else if (updatedPart[0] === "\xdb") {
        // ~m
        if (language === "Gurmukhi") {
          result += gurmukhiAddak;
        }
      }
      if (consonants.has(updatedPart[1]) && consonants.has(updatedPart[2])) {
        if (updatedPart[updatedPart.length - 1] === "a") {
          let result1 = "";
          for (let ii = 1; ii < updatedPart.length - 2; ++ii) {
            result1 += consonants.get(updatedPart[ii]) + viraama;
          }
          result +=
            result1 + consonants.get(updatedPart[updatedPart.length - 2]);
        } else {
          let result1 = "";
          for (let ii = 1; ii < updatedPart.length - 1; ++ii) {
            let let1 = consonants.get(updatedPart[ii]);
            if (ii === updatedPart.length - 2) {
              result1 += let1;
            } else {
              result1 += let1 + viraama;
            }
          }

          result1 += kaagunita.get(updatedPart[updatedPart.length - 1]);
          result += result1;
        }
      }
    } else {
      if (updatedPart.includes(caret)) {
        // String contains ^

        // Check for multiple occurrences of ^
        let numberCaret = (updatedPart.match(/\u005E/g) || []).length;

        if (numberCaret === 2) {
          for (let i = 0; i < updatedPart.length - 2; ++i) {
            let str;
            if (updatedPart[i] === caret) {
              str = zwnj;
              ++i;
            } else {
              str = consonants.get(updatedPart[i]) + viraama;
            }
            result += str;
          }
        } else {
          // numberCaret = 1
          let indexCaret = updatedPart.indexOf(caret);
          if (indexCaret === 1) {
            for (let i = 0; i < updatedPart.length - 2; ++i) {
              let str;
              if (updatedPart[i] === caret) {
                // Checking for ^
                str = zwj + viraama;
              } else {
                str = consonants.get(updatedPart[i]);
              }
              if (updatedPart.length > 4) {
                if (i !== updatedPart.length - 3) {
                  result += str;
                } else {
                  result += str + viraama;
                }
              } else {
                result += str;
              }
            }
          } else {
            // indexCaret > 1
            for (let i = 0; i <= indexCaret - 1; ++i) {
              let str;
              str = consonants.get(updatedPart[i]) + viraama;
              result += str;
            }
            //result += zwj;
            for (let i = indexCaret + 1; i < updatedPart.length - 1; ++i) {}
          }
        }
      } else {
        // String does not contain ^
        for (let i = 0; i < updatedPart.length - 2; ++i) {
          result += consonants.get(updatedPart[i]) + viraama;
        }
      }

      if (updatedPart[updatedPart.length - 1] === "a") {
        result += consonants.get(updatedPart[updatedPart.length - 2]);
      } else {
        result +=
          consonants.get(updatedPart[updatedPart.length - 2]) +
          kaagunita.get(updatedPart[updatedPart.length - 1]);
      }
    }
    return result;
  }

  function transliterateEachPart(part, isFirstPart, isLastPart) {
    let result = "";

    let updatedPart = part;
    updatedPart = updatedPart.replace(regex1, "A");
    updatedPart = updatedPart.replace(regex2, "I");
    updatedPart = updatedPart.replace(regex3, "U");
    updatedPart = updatedPart.replace(regex4, "K");
    updatedPart = updatedPart.replace(regex5, "G");
    updatedPart = updatedPart.replace(regex6, "c");
    updatedPart = updatedPart.replace(regex7, "J");
    updatedPart = updatedPart.replace(regex8, "P");
    updatedPart = updatedPart.replace(regex9, "B");
    updatedPart = updatedPart.replace(regex10, "S");
    updatedPart = updatedPart.replace(regex11, "C");
    updatedPart = updatedPart.replace(regex12, "\xd2");
    updatedPart = updatedPart.replace(regex13, "\xd1");
    updatedPart = updatedPart.replace(regex14, "\xd1");
    updatedPart = updatedPart.replace(regex15, "\xd3");
    updatedPart = updatedPart.replace(regex16, "\xd4");
    updatedPart = updatedPart.replace(regex17, "\xd5");
    updatedPart = updatedPart.replace(regex18, "\xd6");
    updatedPart = updatedPart.replace(regex19, "\xd9");
    updatedPart = updatedPart.replace(regex20, "\xd7");
    updatedPart = updatedPart.replace(regex21, "\xd8");

    if (language != "Tamil") {
      updatedPart = updatedPart.replace(regex22, "R");
    }
    updatedPart = updatedPart.replace(regex23, "\xd0");

    if (language !== "Odia") {
      updatedPart = updatedPart.replace(regex24, "U");
    }

    updatedPart = updatedPart.replace(regex25, "\xda");
    updatedPart = updatedPart.replace(regex26, "\xdb");
    updatedPart = updatedPart.replace(regex28, "z");
    updatedPart = updatedPart.replace(regex29, "\xdc");
    updatedPart = updatedPart.replace(regex30, "x");
    updatedPart = updatedPart.replace(regex33, "x");
    updatedPart = updatedPart.replace(regex32, "\xde");
    updatedPart = updatedPart.replace(regex34, "\xdf");

    //console.log("Length of updated part ", updatedPart.length);

    if (updatedPart.length === 1) {
      result += handlePartOfLength1(
        updatedPart,
        isFirstPart,
        isLastPart,
        result
      );
    } else if (updatedPart.length === 2) {
      result += handlePartOfLength2(updatedPart, isFirstPart, result);
    } else if (updatedPart.length === 3) {
      result += handlePartOfLength3(updatedPart, isFirstPart, result);
    } else {
      // updatedPart.length > 3
      result += handlePartOfLengthGreaterThan3(updatedPart, result);
    }
    return result;
  }

  function copyInputText() {
    // Copy input text to clipboard
    inputTextPanel.select();
    inputTextPanel.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Input text copied to clipboard");
  }

  function copyOutputText() {
    // Copy output text to clipboard
    outputTextPanel.select();
    outputTextPanel.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Output text copied to clipboard");
  }
})();
