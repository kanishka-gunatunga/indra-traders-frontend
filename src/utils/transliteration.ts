export const singlishToSinhala = (text: string): string => {
    let res = text;

    const nVowels = 26;
    const consonants: string[] = [];
    const consonantsUni: string[] = [];
    const vowels: string[] = [];
    const vowelsUni: string[] = [];
    const vowelModifiersUni: string[] = [];
    const specialConsonants: RegExp[] = [];
    const specialConsonantsUni: string[] = [];
    const specialCharUni: string[] = [];
    const specialChar: string[] = [];

    vowelsUni[0] = 'ඌ';
    vowels[0] = 'oo';
    vowelModifiersUni[0] = 'ූ';
    vowelsUni[1] = 'ඕ';
    vowels[1] = 'o\\)';
    vowelModifiersUni[1] = 'ෝ';
    vowelsUni[2] = 'ඕ';
    vowels[2] = 'oe';
    vowelModifiersUni[2] = 'ෝ';
    vowelsUni[3] = 'ආ';
    vowels[3] = 'aa';
    vowelModifiersUni[3] = 'ා';
    vowelsUni[4] = 'ආ';
    vowels[4] = 'a\\)';
    vowelModifiersUni[4] = 'ා';
    vowelsUni[5] = 'ඈ';
    vowels[5] = 'Aa';
    vowelModifiersUni[5] = 'ෑ';
    vowelsUni[6] = 'ඈ';
    vowels[6] = 'A\\)';
    vowelModifiersUni[6] = 'ෑ';
    vowelsUni[7] = 'ඈ';
    vowels[7] = 'ae';
    vowelModifiersUni[7] = 'ෑ';
    vowelsUni[8] = 'ඊ';
    vowels[8] = 'ii';
    vowelModifiersUni[8] = 'ී';
    vowelsUni[9] = 'ඊ';
    vowels[9] = 'i\\)';
    vowelModifiersUni[9] = 'ී';
    vowelsUni[10] = 'ඊ';
    vowels[10] = 'ie';
    vowelModifiersUni[10] = 'ී';
    vowelsUni[11] = 'ඊ';
    vowels[11] = 'ee';
    vowelModifiersUni[11] = 'ී';
    vowelsUni[12] = 'ඒ';
    vowels[12] = 'ea';
    vowelModifiersUni[12] = 'ේ';
    vowelsUni[13] = 'ඒ';
    vowels[13] = 'e\\)';
    vowelModifiersUni[13] = 'ේ';
    vowelsUni[14] = 'ඒ';
    vowels[14] = 'ei';
    vowelModifiersUni[14] = 'ේ';
    vowelsUni[15] = 'ඌ';
    vowels[15] = 'uu';
    vowelModifiersUni[15] = 'ූ';
    vowelsUni[16] = 'ඌ';
    vowels[16] = 'u\\)';
    vowelModifiersUni[16] = 'ූ';
    vowelsUni[17] = 'ඖ';
    vowels[17] = 'au';
    vowelModifiersUni[17] = 'ෞ';
    vowelsUni[18] = 'ඇ';
    vowels[18] = '/\\a';
    vowelModifiersUni[18] = 'ැ';
    vowelsUni[19] = 'අ';
    vowels[19] = 'a';
    vowelModifiersUni[19] = '';
    vowelsUni[20] = 'ඇ';
    vowels[20] = 'A';
    vowelModifiersUni[20] = 'ැ';
    vowelsUni[21] = 'ඉ';
    vowels[21] = 'i';
    vowelModifiersUni[21] = 'ි';
    vowelsUni[22] = 'එ';
    vowels[22] = 'e';
    vowelModifiersUni[22] = 'ෙ';
    vowelsUni[23] = 'උ';
    vowels[23] = 'u';
    vowelModifiersUni[23] = 'ු';
    vowelsUni[24] = 'ඔ';
    vowels[24] = 'o';
    vowelModifiersUni[24] = 'ො';
    vowelsUni[25] = 'ඓ';
    vowels[25] = 'I';
    vowelModifiersUni[25] = 'ෛ';

    specialConsonantsUni[0] = 'ං';
    specialConsonants[0] = /\\n/g;
    specialConsonantsUni[1] = 'ඃ';
    specialConsonants[1] = /\\h/g;
    specialConsonantsUni[2] = 'ඞ';
    specialConsonants[2] = /\\N/g;
    specialConsonantsUni[3] = 'ඍ';
    specialConsonants[3] = /\\R/g;
    specialConsonantsUni[4] = 'ර්' + '\u200D';
    specialConsonants[4] = /R/g;
    specialConsonantsUni[5] = 'ර්' + '\u200D';
    specialConsonants[5] = /\\r/g;

    consonantsUni[0] = 'ඬ';
    consonants[0] = 'nnd';
    consonantsUni[1] = 'ඳ';
    consonants[1] = 'nndh';
    consonantsUni[2] = 'ඟ';
    consonants[2] = 'nng';
    consonantsUni[3] = 'ථ';
    consonants[3] = 'Th';
    consonantsUni[4] = 'ධ';
    consonants[4] = 'Dh';
    consonantsUni[5] = 'ඝ';
    consonants[5] = 'gh';
    consonantsUni[6] = 'ඡ';
    consonants[6] = 'Ch';
    consonantsUni[7] = 'ඵ';
    consonants[7] = 'ph';
    consonantsUni[8] = 'භ';
    consonants[8] = 'bh';
    consonantsUni[9] = 'ශ';
    consonants[9] = 'sh';
    consonantsUni[10] = 'ෂ';
    consonants[10] = 'Sh';
    consonantsUni[11] = 'ඥ';
    consonants[11] = 'GN';
    consonantsUni[12] = 'ඤ';
    consonants[12] = 'KN';
    consonantsUni[13] = 'ළු';
    consonants[13] = 'Lu';
    consonantsUni[14] = 'ද';
    consonants[14] = 'dh';
    consonantsUni[15] = 'ච';
    consonants[15] = 'ch';
    consonantsUni[16] = 'ඛ';
    consonants[16] = 'kh';
    consonantsUni[17] = 'ත';
    consonants[17] = 'th';
    consonantsUni[18] = 'ට';
    consonants[18] = 't';
    consonantsUni[19] = 'ක';
    consonants[19] = 'k';
    consonantsUni[20] = 'ඩ';
    consonants[20] = 'd';
    consonantsUni[21] = 'න';
    consonants[21] = 'n';
    consonantsUni[22] = 'ප';
    consonants[22] = 'p';
    consonantsUni[23] = 'බ';
    consonants[23] = 'b';
    consonantsUni[24] = 'ම';
    consonants[24] = 'm';
    consonantsUni[25] = '‍ය';
    consonants[25] = '\\u005C' + 'y';
    consonantsUni[26] = '‍ය';
    consonants[26] = 'Y';
    consonantsUni[27] = 'ය';
    consonants[27] = 'y';
    consonantsUni[28] = 'ජ';
    consonants[28] = 'j';
    consonantsUni[29] = 'ල';
    consonants[29] = 'l';
    consonantsUni[30] = 'ව';
    consonants[30] = 'v';
    consonantsUni[31] = 'ව';
    consonants[31] = 'w';
    consonantsUni[32] = 'ස';
    consonants[32] = 's';
    consonantsUni[33] = 'හ';
    consonants[33] = 'h';
    consonantsUni[34] = 'ණ';
    consonants[34] = 'N';
    consonantsUni[35] = 'ළ';
    consonants[35] = 'L';
    consonantsUni[36] = 'ඛ';
    consonants[36] = 'K';
    consonantsUni[37] = 'ඝ';
    consonants[37] = 'G';
    consonantsUni[38] = 'ඨ';
    consonants[38] = 'T';
    consonantsUni[39] = 'ඪ';
    consonants[39] = 'D';
    consonantsUni[40] = 'ඵ';
    consonants[40] = 'P';
    consonantsUni[41] = 'ඹ';
    consonants[41] = 'B';
    consonantsUni[42] = 'ෆ';
    consonants[42] = 'f';
    consonantsUni[43] = 'ඣ';
    consonants[43] = 'q';
    consonantsUni[44] = 'ග';
    consonants[44] = 'g';
    consonantsUni[45] = 'ර';
    consonants[45] = 'r';

    specialCharUni[0] = 'ෲ';
    specialChar[0] = 'ruu';
    specialCharUni[1] = 'ෘ';
    specialChar[1] = 'ru';

    for (let i = 0; i < specialConsonants.length; i++) {
        res = res.replace(specialConsonants[i], specialConsonantsUni[i]);
    }

    for (let i = 0; i < specialCharUni.length; i++) {
        for (let j = 0; j < consonants.length; j++) {
            const s = consonants[j] + specialChar[i];
            const v = consonantsUni[j] + specialCharUni[i];
            const r = new RegExp(s, "g");
            res = res.replace(r, v);
        }
    }
    // Consonants + Rakaransha + vowel modifiers
    for (let j = 0; j < consonants.length; j++) {
        for (let i = 0; i < vowels.length; i++) {
            const s = consonants[j] + "r" + vowels[i];
            const v = consonantsUni[j] + "්‍ර" + vowelModifiersUni[i];
            const r = new RegExp(s, "g");
            res = res.replace(r, v);
        }
        const s = consonants[j] + "r";
        const v = consonantsUni[j] + "්‍ර";
        const r = new RegExp(s, "g");
        res = res.replace(r, v);
    }
    // Consonants + vowel modifiers
    for (let i = 0; i < consonants.length; i++) {
        for (let j = 0; j < nVowels; j++) {
            const s = consonants[i] + vowels[j];
            const v = consonantsUni[i] + vowelModifiersUni[j];
            const r = new RegExp(s, "g");
            res = res.replace(r, v);
        }
    }
    // Consonants + HAL
    for (let i = 0; i < consonants.length; i++) {
        const r = new RegExp(consonants[i], "g");
        res = res.replace(r, consonantsUni[i] + "්");
    }
    // Vowels
    for (let i = 0; i < vowels.length; i++) {
        const r = new RegExp(vowels[i], "g");
        res = res.replace(r, vowelsUni[i]);
    }

    return res;
};


export const tanglishToTamil = (text: string): string => {
    let res = text;

    const replacements: [RegExp, string][] = [
        [/njau/g, "ஞௌ"], [/njai/g, "ஞை"], [/njee/g, "ஞே"], [/njoo/g, "ஞோ"], [/njaa/g, "ஞா"], [/njuu/g, "ஞூ"], [/njii/g, "ஞீ"], [/nja/g, "ஞ"], [/nji/g, "ஞி"], [/njI/g, "ஞீ"], [/njA/g, "ஞா"], [/nje/g, "ஞெ"], [/njE/g, "ஞே"], [/njo/g, "ஞொ"], [/njO/g, "ஞோ"], [/nju/g, "ஞு"], [/njU/g, "ஞூ"], [/nj/g, "ஞ்"],
        [/ngau/g, "ஙௌ"], [/ngai/g, "ஙை"], [/ngee/g, "ஙே"], [/ngoo/g, "ஙோ"], [/ngaa/g, "ஙா"], [/nguu/g, "ஙூ"], [/ngii/g, "ஙீ"], [/nga/g, "ங"], [/ngi/g, "ஙி"], [/ngI/g, "ஙீ"], [/ngA/g, "ஙா"], [/nge/g, "ஙெ"], [/ngE/g, "ஙே"], [/ngo/g, "ஙொ"], [/ngO/g, "ஙோ"], [/ngu/g, "ஙு"], [/ngU/g, "ஙூ"], [/ng/g, "ங்"],
        [/shau/g, "ஷௌ"], [/shai/g, "ஷை"], [/shee/g, "ஷே"], [/shoo/g, "ஷோ"], [/shaa/g, "ஷா"], [/shuu/g, "ஷூ"], [/shii/g, "ஷீ"], [/sha/g, "ஷ"], [/shi/g, "ஷி"], [/shI/g, "ஷீ"], [/shA/g, "ஷா"], [/she/g, "ஷெ"], [/shE/g, "ஷே"], [/sho/g, "ஷொ"], [/shO/g, "ஷோ"], [/shu/g, "ஷு"], [/shU/g, "ஷூ"], [/sh/g, "ஷ்"],
        [/ nau/g, " நௌ"], [/ nai/g, " நை"], [/ nee/g, " நே"], [/ noo/g, " நோ"], [/ naa/g, " நா"], [/ nuu/g, " நூ"], [/ nii/g, " நீ"], [/ na/g, " ந"], [/ ni/g, " நி"], [/ nI/g, " நீ"], [/ nA/g, " நா"], [/ ne/g, " நெ"], [/ nE/g, " நே"], [/ no/g, " நொ"], [/ nO/g, " நோ"], [/ nu/g, " நு"], [/ nU/g, " நூ"], [/ nth/g, " ந்"],
        [/-nau/g, "நௌ"], [/-nai/g, "நை"], [/-nee/g, "நே"], [/-noo/g, "நோ"], [/-naa/g, "நா"], [/-nuu/g, "நூ"], [/-nii/g, "நீ"], [/-na/g, "ந"], [/-ni/g, "நி"], [/-nI/g, "நீ"], [/-nA/g, "நா"], [/-ne/g, "நெ"], [/-nE/g, "நே"], [/-no/g, "நொ"], [/-nO/g, "நோ"], [/-nu/g, "நு"], [/-nU/g, "நூ"],
        [/n-au/g, "நௌ"], [/n-ai/g, "நை"], [/n-ee/g, "நே"], [/n-oo/g, "நோ"], [/n-aa/g, "நா"], [/n-uu/g, "நூ"], [/n-ii/g, "நீ"], [/n-a/g, "ந"], [/n-i/g, "நி"], [/n-I/g, "நீ"], [/n-A/g, "நா"], [/n-e/g, "நெ"], [/n-E/g, "நே"], [/n-o/g, "நொ"], [/n-O/g, "நோ"], [/n-u/g, "நு"], [/n-U/g, "நூ"],
        [/wau/g, "நௌ"], [/wai/g, "நை"], [/wee/g, "நே"], [/woo/g, "நோ"], [/waa/g, "நா"], [/wuu/g, "நூ"], [/wii/g, "நீ"], [/wa/g, "ந"], [/wi/g, "நி"], [/wI/g, "நீ"], [/wA/g, "நா"], [/we/g, "நெ"], [/wE/g, "நே"], [/wo/g, "நொ"], [/wO/g, "நோ"], [/wu/g, "நு"], [/wU/g, "நூ"],
        [/ n/g, " ந்"], [/n-/g, "ந்"], [/-n/g, "ந்"], [/w/g, "ந்"],
        [/nthau/g, "ந்தௌ"], [/nthai/g, "ந்தை"], [/nthee/g, "ந்தே"], [/nthoo/g, "ந்தோ"], [/nthaa/g, "ந்தா"], [/nthuu/g, "ந்தூ"], [/nthii/g, "ந்தீ"], [/ntha/g, "ந்த"], [/nthi/g, "ந்தி"], [/nthI/g, "ந்தீ"], [/nthA/g, "ந்தா"], [/nthe/g, "ந்தெ"], [/nthE/g, "ந்தே"], [/ntho/g, "ந்தொ"], [/nthO/g, "ந்தோ"], [/nthu/g, "ந்து"], [/nthU/g, "ந்தூ"], [/nth/g, "ந்"],
        [/dhau/g, "தௌ"], [/dhai/g, "தை"], [/dhee/g, "தே"], [/dhoo/g, "தோ"], [/dhaa/g, "தா"], [/dhuu/g, "தூ"], [/dhii/g, "தீ"], [/dha/g, "த"], [/dhi/g, "தி"], [/dhI/g, "தீ"], [/dhA/g, "தா"], [/dhe/g, "தெ"], [/dhE/g, "தே"], [/dho/g, "தொ"], [/dhO/g, "தோ"], [/dhu/g, "து"], [/dhU/g, "தூ"], [/dh/g, "த்"],
        [/chau/g, "சௌ"], [/chai/g, "சை"], [/chee/g, "சே"], [/choo/g, "சோ"], [/chaa/g, "சா"], [/chuu/g, "சூ"], [/chii/g, "சீ"], [/cha/g, "ச"], [/chi/g, "சி"], [/chI/g, "சீ"], [/chA/g, "சா"], [/che/g, "செ"], [/chE/g, "சே"], [/cho/g, "சொ"], [/chO/g, "சோ"], [/chu/g, "சு"], [/chU/g, "சூ"], [/ch/g, "ச்"],
        [/zhau/g, "ழௌ"], [/zhai/g, "ழை"], [/zhee/g, "ழே"], [/zhoo/g, "ழோ"], [/zhaa/g, "ழா"], [/zhuu/g, "ழூ"], [/zhii/g, "ழீ"], [/zha/g, "ழ"], [/zhi/g, "ழி"], [/zhI/g, "ழீ"], [/zhA/g, "ழா"], [/zhe/g, "ழெ"], [/zhE/g, "ழே"], [/zho/g, "ழொ"], [/zhO/g, "ழோ"], [/zhu/g, "ழு"], [/zhU/g, "ழூ"], [/zh/g, "ழ்"],
        [/zau/g, "ழௌ"], [/zai/g, "ழை"], [/zee/g, "ழே"], [/zoo/g, "ழோ"], [/zaa/g, "ழா"], [/zuu/g, "ழூ"], [/zii/g, "ழீ"], [/za/g, "ழ"], [/zi/g, "ழி"], [/zI/g, "ழீ"], [/zA/g, "ழா"], [/ze/g, "ழெ"], [/zE/g, "ழே"], [/zo/g, "ழொ"], [/zO/g, "ழோ"], [/zu/g, "ழு"], [/zU/g, "ழூ"], [/z/g, "ழ்"],
        [/jau/g, "ஜௌ"], [/jai/g, "ஜை"], [/jee/g, "ஜே"], [/joo/g, "ஜோ"], [/jaa/g, "ஜா"], [/juu/g, "ஜூ"], [/jii/g, "ஜீ"], [/ja/g, "ஜ"], [/ji/g, "ஜி"], [/jI/g, "ஜீ"], [/jA/g, "ஜா"], [/je/g, "ஜெ"], [/jE/g, "ஜே"], [/jo/g, "ஜொ"], [/jO/g, "ஜோ"], [/ju/g, "ஜு"], [/jU/g, "ஜூ"], [/j/g, "ஜ்"],
        [/thau/g, "தௌ"], [/thai/g, "தை"], [/thee/g, "தே"], [/thoo/g, "தோ"], [/thaa/g, "தா"], [/thuu/g, "தூ"], [/thii/g, "தீ"], [/tha/g, "த"], [/thi/g, "தி"], [/thI/g, "தீ"], [/thA/g, "தா"], [/the/g, "தெ"], [/thE/g, "தே"], [/tho/g, "தொ"], [/thO/g, "தோ"], [/thu/g, "து"], [/thU/g, "தூ"], [/th/g, "த்"],
        [/-hau/g, "ஹௌ"], [/-hai/g, "ஹை"], [/-hee/g, "ஹே"], [/-hoo/g, "ஹோ"], [/-haa/g, "ஹா"], [/-huu/g, "ஹூ"], [/-hii/g, "ஹீ"], [/-ha/g, "ஹ"], [/-hi/g, "ஹி"], [/-hI/g, "ஹீ"], [/-hA/g, "ஹா"], [/-he/g, "ஹெ"], [/-hE/g, "ஹே"], [/-ho/g, "ஹொ"], [/-hO/g, "ஹோ"], [/-hu/g, "ஹு"], [/-hU/g, "ஹூ"], [/-h/g, "ஹ்"],
        [/hau/g, "கௌ"], [/hai/g, "கை"], [/hee/g, "கே"], [/hoo/g, "கோ"], [/haa/g, "கா"], [/huu/g, "கூ"], [/hii/g, "கீ"], [/ha/g, "க"], [/hi/g, "கி"], [/hI/g, "கீ"], [/hA/g, "கா"], [/he/g, "கெ"], [/hE/g, "கே"], [/ho/g, "கொ"], [/hO/g, "கோ"], [/hu/g, "கு"], [/hU/g, "கூ"], [/h/g, "க்"],
        [/kau/g, "கௌ"], [/kai/g, "கை"], [/kee/g, "கே"], [/koo/g, "கோ"], [/kaa/g, "கா"], [/kuu/g, "கூ"], [/kii/g, "கீ"], [/ka/g, "க"], [/ki/g, "கி"], [/kI/g, "கீ"], [/kA/g, "கா"], [/ke/g, "கெ"], [/kE/g, "கே"], [/ko/g, "கொ"], [/kO/g, "கோ"], [/ku/g, "கு"], [/kU/g, "கூ"], [/k/g, "க்"],
        [/-sau/g, "ஸௌ"], [/-sai/g, "ஸை"], [/-see/g, "ஸே"], [/-soo/g, "ஸோ"], [/-saa/g, "ஸா"], [/-suu/g, "ஸூ"], [/-sii/g, "ஸீ"], [/-sa/g, "ஸ"], [/-si/g, "ஸி"], [/-sI/g, "ஸீ"], [/-sA/g, "ஸா"], [/-se/g, "ஸெ"], [/-sE/g, "ஸே"], [/-so/g, "ஸொ"], [/-sO/g, "ஸோ"], [/-su/g, "ஸு"], [/-sU/g, "ஸூ"], [/-s/g, "ஸ்"],
        [/Sau/g, "ஸௌ"], [/Sai/g, "ஸை"], [/See/g, "ஸே"], [/Soo/g, "ஸோ"], [/Saa/g, "ஸா"], [/Suu/g, "ஸூ"], [/Sii/g, "ஸீ"], [/Sa/g, "ஸ"], [/Si/g, "ஸி"], [/SI/g, "ஸீ"], [/SA/g, "ஸா"], [/Se/g, "ஸெ"], [/SE/g, "ஸே"], [/So/g, "ஸொ"], [/SO/g, "ஸோ"], [/Su/g, "ஸு"], [/SU/g, "ஸூ"], [/S/g, "ஸ்"],
        [/rau/g, "ரௌ"], [/rai/g, "ரை"], [/ree/g, "ரே"], [/roo/g, "ரோ"], [/raa/g, "ரா"], [/ruu/g, "ரூ"], [/rii/g, "ரீ"], [/ra/g, "ர"], [/ri/g, "ரி"], [/rI/g, "ரீ"], [/rA/g, "ரா"], [/re/g, "ரெ"], [/rE/g, "ரே"], [/ro/g, "ரொ"], [/rO/g, "ரோ"], [/ru/g, "ரு"], [/rU/g, "ரூ"], [/r/g, "ர்"],
        [/Rau/g, "றௌ"], [/Rai/g, "றை"], [/Ree/g, "றே"], [/Roo/g, "றோ"], [/Raa/g, "றா"], [/Ruu/g, "றூ"], [/Rii/g, "றீ"], [/Ra/g, "ற"], [/Ri/g, "றி"], [/RI/g, "றீ"], [/RA/g, "றா"], [/Re/g, "றெ"], [/RE/g, "றே"], [/Ro/g, "றொ"], [/RO/g, "றோ"], [/Ru/g, "று"], [/RU/g, "றூ"], [/R/g, "ற்"],
        [/tau/g, "டௌ"], [/tai/g, "டை"], [/tee/g, "டே"], [/too/g, "டோ"], [/taa/g, "டா"], [/tuu/g, "டூ"], [/tii/g, "டீ"], [/ta/g, "ட"], [/ti/g, "டி"], [/tI/g, "டீ"], [/tA/g, "டா"], [/te/g, "டெ"], [/tE/g, "டே"], [/to/g, "டொ"], [/tO/g, "டோ"], [/tu/g, "டு"], [/tU/g, "டூ"], [/t/g, "ட்"],
        [/sau/g, "சௌ"], [/sai/g, "சை"], [/see/g, "சே"], [/soo/g, "சோ"], [/saa/g, "சா"], [/suu/g, "சூ"], [/sii/g, "சீ"], [/sa/g, "ச"], [/si/g, "சி"], [/sI/g, "சீ"], [/sA/g, "சா"], [/se/g, "செ"], [/sE/g, "சே"], [/so/g, "சொ"], [/sO/g, "சோ"], [/su/g, "சு"], [/sU/g, "சூ"], [/s/g, "ச்"],
        [/pau/g, "பௌ"], [/pai/g, "பை"], [/pee/g, "பே"], [/poo/g, "போ"], [/paa/g, "பா"], [/puu/g, "பூ"], [/pii/g, "பீ"], [/pa/g, "ப"], [/pi/g, "பி"], [/pI/g, "பீ"], [/pA/g, "பா"], [/pe/g, "பெ"], [/pE/g, "பே"], [/po/g, "பொ"], [/pO/g, "போ"], [/pu/g, "பு"], [/pU/g, "பூ"], [/p/g, "ப்"],
        [/bau/g, "பௌ"], [/bai/g, "பை"], [/bee/g, "பே"], [/boo/g, "போ"], [/baa/g, "பா"], [/buu/g, "பூ"], [/bii/g, "பீ"], [/ba/g, "ப"], [/bi/g, "பி"], [/bI/g, "பீ"], [/bA/g, "பா"], [/be/g, "பெ"], [/bE/g, "பே"], [/bo/g, "பொ"], [/bO/g, "போ"], [/bu/g, "பு"], [/bU/g, "பூ"], [/b/g, "ப்"],
        [/mau/g, "மௌ"], [/mai/g, "மை"], [/mee/g, "மே"], [/moo/g, "மோ"], [/maa/g, "மா"], [/muu/g, "மூ"], [/mii/g, "மீ"], [/ma/g, "ம"], [/mi/g, "மி"], [/mI/g, "மீ"], [/mA/g, "மா"], [/me/g, "மெ"], [/mE/g, "மே"], [/mo/g, "மொ"], [/mO/g, "மோ"], [/mu/g, "மு"], [/mU/g, "மூ"], [/m/g, "ம்"],
        [/yau/g, "யௌ"], [/yai/g, "யை"], [/yee/g, "யே"], [/yoo/g, "யோ"], [/yaa/g, "யா"], [/yuu/g, "யூ"], [/yii/g, "யீ"], [/ya/g, "ய"], [/yi/g, "யி"], [/yI/g, "யீ"], [/yA/g, "யா"], [/ye/g, "யெ"], [/yE/g, "யே"], [/yo/g, "யொ"], [/yO/g, "யோ"], [/yu/g, "யு"], [/yU/g, "யூ"], [/y/g, "ய்"],
        [/dau/g, "டௌ"], [/dai/g, "டை"], [/dee/g, "டே"], [/doo/g, "டோ"], [/daa/g, "டா"], [/duu/g, "டூ"], [/dii/g, "டீ"], [/da/g, "ட"], [/di/g, "டி"], [/dI/g, "டீ"], [/dA/g, "டா"], [/de/g, "டெ"], [/dE/g, "டே"], [/do/g, "டொ"], [/dO/g, "டோ"], [/du/g, "டு"], [/dU/g, "டூ"], [/d/g, "ட்"],
        [/nau/g, "னௌ"], [/nai/g, "னை"], [/nee/g, "னே"], [/noo/g, "னோ"], [/naa/g, "னா"], [/nuu/g, "னூ"], [/nii/g, "னீ"], [/na/g, "ன"], [/ni/g, "னி"], [/nI/g, "னீ"], [/nA/g, "னா"], [/ne/g, "னெ"], [/nE/g, "னே"], [/no/g, "னொ"], [/nO/g, "னோ"], [/nu/g, "னு"], [/nU/g, "னூ"], [/n/g, "ன்"],
        [/Nau/g, "ணௌ"], [/Nai/g, "ணை"], [/Nee/g, "ணே"], [/Noo/g, "ணோ"], [/Naa/g, "ணா"], [/Nuu/g, "ணூ"], [/Nii/g, "ணீ"], [/Na/g, "ண"], [/Ni/g, "ணி"], [/NI/g, "ணீ"], [/NA/g, "ணா"], [/Ne/g, "ணெ"], [/NE/g, "ணே"], [/No/g, "ணொ"], [/NO/g, "ணோ"], [/Nu/g, "ணு"], [/NU/g, "ணூ"], [/N/g, "ண்"],
        [/lau/g, "லௌ"], [/lai/g, "லை"], [/lee/g, "லே"], [/loo/g, "லோ"], [/laa/g, "லா"], [/luu/g, "லூ"], [/lii/g, "லீ"], [/la/g, "ல"], [/li/g, "லி"], [/lI/g, "லீ"], [/lA/g, "லா"], [/le/g, "லெ"], [/lE/g, "லே"], [/lo/g, "லொ"], [/lO/g, "லோ"], [/lu/g, "லு"], [/lU/g, "லூ"], [/l/g, "ல்"],
        [/Lau/g, "ளௌ"], [/Lai/g, "ளை"], [/Lee/g, "ளே"], [/Loo/g, "ளோ"], [/Laa/g, "ளா"], [/Luu/g, "ளூ"], [/Lii/g, "ளீ"], [/La/g, "ள"], [/Li/g, "ளி"], [/LI/g, "ளீ"], [/LA/g, "ளா"], [/Le/g, "ளெ"], [/LE/g, "ளே"], [/Lo/g, "ளொ"], [/LO/g, "ளோ"], [/Lu/g, "ளு"], [/LU/g, "ளூ"], [/L/g, "ள்"],
        [/vau/g, "வௌ"], [/vai/g, "வை"], [/vee/g, "வே"], [/voo/g, "வோ"], [/vaa/g, "வா"], [/vuu/g, "வூ"], [/vii/g, "வீ"], [/va/g, "வ"], [/vi/g, "வி"], [/vI/g, "வீ"], [/vA/g, "வா"], [/ve/g, "வெ"], [/vE/g, "வே"], [/vo/g, "வொ"], [/vO/g, "வோ"], [/vu/g, "வு"], [/vU/g, "வூ"], [/v/g, "வ்"],
        [/gau/g, "கௌ"], [/gai/g, "கை"], [/gee/g, "கே"], [/goo/g, "கோ"], [/gaa/g, "கா"], [/guu/g, "கூ"], [/gii/g, "கீ"], [/ga/g, "க"], [/gi/g, "கி"], [/gI/g, "கீ"], [/gA/g, "கா"], [/ge/g, "கெ"], [/gE/g, "கே"], [/go/g, "கொ"], [/gO/g, "கோ"], [/gu/g, "கு"], [/gU/g, "கூ"], [/g/g, "க்"],
        [/au/g, "ஔ"], [/ai/g, "ஐ"], [/aa/g, "ஆ"], [/ee/g, "ஏ"], [/ii/g, "ஈ"], [/uu/g, "ஊ"], [/oo/g, "ஓ"],
        [/-1000/g, "௲"], [/-100/g, "௱"], [/-10/g, "௰"], [/-1/g, "௧"], [/-2/g, "௨"], [/-3/g, "௩"], [/-4/g, "௪"], [/-5/g, "௫"], [/-6/g, "௬"], [/-7/g, "௭"], [/-8/g, "௮"], [/-9/g, "௯"],
        [/i/g, "இ"], [/I/g, "ஈ"], [/a/g, "அ"], [/A/g, "ஆ"], [/e/g, "எ"], [/E/g, "ஏ"], [/u/g, "உ"], [/U/g, "ஊ"], [/o/g, "ஒ"], [/O/g, "ஓ"], [/x/g, "௯"], [/q/g, "ஃ"]
    ];

    for (const [pattern, replacement] of replacements) {
        res = res.replace(pattern, replacement);
    }
    return res;
};