function range(begin, end) {
	let array = [];
	for (let i = begin; i <= end; i++)
		array.push(i);
	for (let i = begin; i >= end; i--)
		array.push(i);
	return array;
}

const SHEET_X = 0;
const SHEET_Y = 1;
const SHEET_WIDTH = 2;
const SHEET_HEIGHT = 3;
const OFFSET_X = 4;
const OFFSET_Y = 5;
const ROTATED = 6;

window.BonziData = {
	size: {
		x: 200,
		y: 160
	},
	spritemaps: {
		default: [[750,225,79,111,61,40,false],[441,1060,3,5,97,78,false],[445,555,5,8,91,75,true],[224,924,9,11,82,72,false],[644,209,14,16,73,68,false],[110,1108,20,21,64,64,true],[790,336,27,28,58,60,false],[44,1128,33,34,58,61,false],[0,1128,38,44,63,61,true],[1112,890,47,54,67,62,true],[775,446,54,62,73,61,true],[1101,1080,63,63,79,58,false],[865,557,76,70,84,48,true],[960,960,88,79,83,39,true],[338,892,97,85,77,37,false],[829,318,107,91,69,37,false],[119,832,114,92,61,41,false],[1065,0,113,101,58,37,true],[337,229,108,111,57,33,false],[231,107,106,120,56,31,false],[938,0,103,127,51,29,true],[154,0,107,142,38,17,true],[0,730,119,129,27,31,false],[335,340,116,106,30,45,true],[675,123,117,102,26,49,false],[829,210,108,108,33,43,false],[938,182,79,111,61,40,true],[151,223,79,112,61,40,false],[233,892,76,105,62,47,true],[837,409,76,99,62,53,true],[126,335,98,128,52,20,false],[0,462,116,135,35,21,false],[691,0,123,125,30,29,true],[0,597,133,117,21,36,true],[565,0,126,110,21,49,false],[0,335,126,127,35,26,false],[816,0,122,122,24,31,false],[335,977,88,106,22,45,true],[773,973,77,85,48,64,false],[1039,923,73,79,64,63,false],[1034,1080,59,67,84,59,true],[1112,937,50,40,108,61,false],[792,123,37,31,121,60,false],[906,633,29,24,119,68,false],[802,743,20,17,113,78,true],[775,500,13,11,104,84,true],[111,859,8,8,95,85,false],[111,867,8,7,84,83,false],[441,451,5,4,81,82,true],[117,711,2,2,81,81,false],[116,462,1,1,0,0,false],[1049,192,79,111,61,40,true],[152,111,79,112,61,39,false],[111,924,79,113,61,38,true],[938,103,79,112,61,39,true],[1050,113,79,112,61,39,true],[937,261,77,111,62,40,true],[1048,271,77,111,62,40,true],[0,859,134,111,33,40,true],[0,0,154,111,22,40,false],[0,111,152,112,23,39,false],[0,223,151,112,23,39,false],[936,338,92,111,47,40,true],[1047,348,99,111,39,40,true],[224,456,105,111,29,40,true],[230,227,107,112,22,39,false],[445,226,106,112,23,39,false],[335,456,104,110,25,41,true],[223,561,104,110,25,41,false],[227,671,104,110,25,41,false],[327,561,104,110,25,41,false],[331,671,104,110,25,41,false],[435,671,104,110,25,41,false],[428,781,104,110,25,41,false],[444,1060,103,110,26,41,true],[532,781,104,110,25,41,false],[633,1059,104,110,25,41,true],[445,451,104,110,25,41,true],[683,552,103,110,26,41,false],[699,662,103,110,26,41,false],[686,336,104,110,25,41,false],[555,449,104,110,25,41,true],[743,1058,104,110,25,41,true],[665,448,104,110,25,41,true],[715,772,104,110,25,41,false],[1046,605,104,110,25,41,true],[802,633,104,110,25,41,false],[819,743,104,110,25,41,false],[837,853,104,110,25,41,false],[853,1044,104,110,25,41,false],[923,668,104,110,25,41,false],[1027,709,104,110,25,41,true],[224,339,111,117,18,34,false],[437,109,113,117,16,34,false],[119,711,108,121,21,30,false],[117,588,106,123,28,28,false],[116,463,105,125,33,26,false],[224,968,77,111,62,40,true],[222,1045,80,111,60,40,true],[333,1065,85,111,57,40,true],[431,560,89,111,53,40,false],[441,340,83,111,59,40,false],[941,850,80,110,61,41,false],[1021,813,80,110,61,41,false],[850,963,81,110,60,41,true],[435,891,85,110,58,41,true],[233,781,98,111,46,40,false],[644,225,106,111,38,40,false],[331,781,97,111,48,40,false],[441,976,84,111,60,40,true],[545,891,84,111,59,40,true],[663,975,83,110,58,41,true],[552,975,84,111,56,40,true],[520,555,84,111,56,40,false],[539,666,81,111,59,40,false],[524,338,79,111,61,40,false],[603,337,83,111,59,40,false],[829,122,88,109,58,42,true],[550,110,99,125,58,26,true],[551,209,93,128,66,23,false],[337,104,100,125,61,26,false],[604,553,79,111,61,40,false],[620,664,79,111,61,40,false],[636,775,79,111,61,40,false],[936,430,79,111,61,40,true],[1047,447,79,111,61,40,true],[786,500,79,111,61,40,false],[936,509,79,111,61,40,true],[1047,526,79,111,61,40,true],[554,1059,79,107,61,44,false],[656,886,91,89,54,62,false],[747,882,91,90,54,61,true],[935,588,80,111,60,16,true],[1101,813,77,64,62,15,true],[865,485,72,71,64,0,true],[923,778,72,82,64,7,true],[1039,1002,76,78,62,6,false],[957,1048,77,88,62,35,false],[110,1003,112,105,43,53,false],[296,0,142,104,29,53,false],[0,993,135,110,32,47,true],[438,0,127,109,32,42,false]],
		legacy: [[0,0,200,160,0,0,false],[200,0,200,160,0,0,false],[400,0,200,160,0,0,false],[600,0,200,160,0,0,false],[800,0,200,160,0,0,false],[1000,0,200,160,0,0,false],[1200,0,200,160,0,0,false],[1400,0,200,160,0,0,false],[1600,0,200,160,0,0,false],[1800,0,200,160,0,0,false],[2000,0,200,160,0,0,false],[2200,0,200,160,0,0,false],[0,160,200,160,0,0,false],[200,160,200,160,0,0,false],[400,160,200,160,0,0,false],[600,160,200,160,0,0,false],[800,160,200,160,0,0,false],[1000,160,200,160,0,0,false],[1200,160,200,160,0,0,false],[1400,160,200,160,0,0,false],[1600,160,200,160,0,0,false],[1800,160,200,160,0,0,false],[2000,160,200,160,0,0,false],[2200,160,200,160,0,0,false],[0,320,200,160,0,0,false],[200,320,200,160,0,0,false],[400,320,200,160,0,0,false],[600,320,200,160,0,0,false],[800,320,200,160,0,0,false],[1000,320,200,160,0,0,false],[1200,320,200,160,0,0,false],[1400,320,200,160,0,0,false],[1600,320,200,160,0,0,false],[1800,320,200,160,0,0,false],[2000,320,200,160,0,0,false],[2200,320,200,160,0,0,false],[0,480,200,160,0,0,false],[200,480,200,160,0,0,false],[400,480,200,160,0,0,false],[600,480,200,160,0,0,false],[800,480,200,160,0,0,false],[1000,480,200,160,0,0,false],[1200,480,200,160,0,0,false],[1400,480,200,160,0,0,false],[1600,480,200,160,0,0,false],[1800,480,200,160,0,0,false],[2000,480,200,160,0,0,false],[2200,480,200,160,0,0,false],[0,640,200,160,0,0,false],[200,640,200,160,0,0,false],[400,640,200,160,0,0,false],[600,640,200,160,0,0,false],[800,640,200,160,0,0,false],[1000,640,200,160,0,0,false],[1200,640,200,160,0,0,false],[1400,640,200,160,0,0,false],[1600,640,200,160,0,0,false],[1800,640,200,160,0,0,false],[2000,640,200,160,0,0,false],[2200,640,200,160,0,0,false],[0,800,200,160,0,0,false],[200,800,200,160,0,0,false],[400,800,200,160,0,0,false],[600,800,200,160,0,0,false],[800,800,200,160,0,0,false],[1000,800,200,160,0,0,false],[1200,800,200,160,0,0,false],[1400,800,200,160,0,0,false],[1600,800,200,160,0,0,false],[1800,800,200,160,0,0,false],[2000,800,200,160,0,0,false],[2200,800,200,160,0,0,false],[0,960,200,160,0,0,false],[200,960,200,160,0,0,false],[400,960,200,160,0,0,false],[600,960,200,160,0,0,false],[800,960,200,160,0,0,false],[1000,960,200,160,0,0,false],[1200,960,200,160,0,0,false],[1400,960,200,160,0,0,false],[1600,960,200,160,0,0,false],[1800,960,200,160,0,0,false],[2000,960,200,160,0,0,false],[2200,960,200,160,0,0,false],[0,1120,200,160,0,0,false],[200,1120,200,160,0,0,false],[400,1120,200,160,0,0,false],[600,1120,200,160,0,0,false],[800,1120,200,160,0,0,false],[1000,1120,200,160,0,0,false],[1200,1120,200,160,0,0,false],[1400,1120,200,160,0,0,false],[1600,1120,200,160,0,0,false],[1800,1120,200,160,0,0,false],[2000,1120,200,160,0,0,false],[2200,1120,200,160,0,0,false],[0,1280,200,160,0,0,false],[200,1280,200,160,0,0,false],[400,1280,200,160,0,0,false],[600,1280,200,160,0,0,false],[800,1280,200,160,0,0,false],[1000,1280,200,160,0,0,false],[1200,1280,200,160,0,0,false],[1400,1280,200,160,0,0,false],[1600,1280,200,160,0,0,false],[1800,1280,200,160,0,0,false],[2000,1280,200,160,0,0,false],[2200,1280,200,160,0,0,false],[0,1440,200,160,0,0,false],[200,1440,200,160,0,0,false],[400,1440,200,160,0,0,false],[600,1440,200,160,0,0,false],[800,1440,200,160,0,0,false],[1000,1440,200,160,0,0,false],[1200,1440,200,160,0,0,false],[1400,1440,200,160,0,0,false],[1600,1440,200,160,0,0,false],[1800,1440,200,160,0,0,false],[2000,1440,200,160,0,0,false],[2200,1440,200,160,0,0,false],[0,1600,200,160,0,0,false],[200,1600,200,160,0,0,false],[400,1600,200,160,0,0,false],[600,1600,200,160,0,0,false],[800,1600,200,160,0,0,false],[1000,1600,200,160,0,0,false],[1200,1600,200,160,0,0,false],[1400,1600,200,160,0,0,false],[1600,1600,200,160,0,0,false],[1800,1600,200,160,0,0,false],[2000,1600,200,160,0,0,false],[2200,1600,200,160,0,0,false],[0,1760,200,160,0,0,false],[200,1760,200,160,0,0,false],[400,1760,200,160,0,0,false],[600,1760,200,160,0,0,false],[800,1760,200,160,0,0,false],[1000,1760,200,160,0,0,false],[1200,1760,200,160,0,0,false],[1400,1760,200,160,0,0,false],[1600,1760,200,160,0,0,false],[1800,1760,200,160,0,0,false]],
		pope: "legacy",
		blessed: "legacy",
		glow: "legacy",
	},
    hats: {
		normal: [
			"bowtie",
			"bieber",
			"bucket",
			"chain",
			"elon",
			"emoji",
			"evil",
            "qmark",
			"horse",
			"kamala",
			"maga",
			"cat",
			"idiot",
			"obama",
			"bfdi",
			"banana",
			"pot",
			"tophat",
			"troll",
			"witch",
            "scarf",
			"wizard",
			"chef",
			"ushanka",
			"sunglasses",
			"party",
			"epic",
			"bush",
			"clown"
		],
		blessed: [
			"dank",
			"cigar",
			"illuminati",
			"propeller",
		],
		vault: [
			"headphones",
			"unicorn",
			"mustache",
			"sprout",
			"glitch",
            "whiteobama",
"rainbowhat",
            "greenhat",
			"purplehat",
			"yellowhat",
			"redhat",
			"whitehat",
			"bluehat",
			"goldhat",
		],
		holidays: {
			halloween: {
				hats: [
					"cauldron",
					"frankenstein",
					"hockey",
					"pumpkin",
					"nopupil",
				],
			},
			christmas: {
				hats: [
					"santa",
					"elf",
					"decorated",
					"rudolph",
				],
			},
		},
		mod: [
			"king",
                        "headphones3",
			"redking",
			"scarf2",
			"headphones2",
			"diamondchain",
		],
		event: [
		]
	},

	colors: {
		normal: [
			"purple",
			"blue",
			"magenta",
			"green",
			"red",
			"_",
			"peedy",
			"black",
			"brown",
			"maroon",
			"yellow",
			"cyan",
			"pink",
			"gray",
			"orange",
			"white"
		],
		blessed: [
			"angel",
			"glow",
			"noob",
			"gold",
		],
	},
	sprite: {
		frames: { width: 200, height: 160 },
		animations: {
			idle: [0],

			surf_intro: [...range(1, 26), "idle"],
			surf_away: range(27, 50),

			shrug_fwd: [...range(51, 61), "shrug_still"],
			shrug_still: [61],
			shrug_back: [...range(61, 51), "idle"],

			earth_fwd: [...range(63, 69), "earth_still"],
			earth_still: [...range(70, 91), "earth_still"],
			earth_back: [...range(92, 97), "idle"],

			cool_fwd: [...range(98, 114), "cool_still"],
			cool_still: [115],
			cool_back: [...range(114, 98), "idle"],

			praise_fwd: [...range(116, 119), "praise_still"],
			praise_still: [120],
			praise_back: [...range(119, 116), "idle"],

			grin_fwd: [...range(121, 127), "grin_still"],
			grin_still: [128],
			grin_back: [...range(123, 121), "idle"],

			backflip: [...range(129, 141), "idle"]
		}
	},
	to_idle: {
		shrug_fwd: "shrug_back",
		shrug_still: "shrug_back",

		earth_fwd: "earth_back",
		earth_still: "earth_back",

		beat_fwd: "beat_back",
		beat_still: "beat_back",

		cool_fwd: "cool_back",
		cool_still: "cool_back",

		praise_fwd: "praise_back",
		praise_still: "praise_back",

		grin_fwd: "grin_back",
		grin_still: "grin_back",
	},
	event_list_joke_open: [
		[
			{
				type: "text",
				text: "Yeah, of course {NAME} wants me to tell a joke."
			},
			{
				type: "anim",
				anim: "praise_fwd",
				ticks: 15
			},
			{
				type: "text",
				text: '"Haha, look at the stupid {COLOR} monkey telling jokes!" Fuck you. It isn\'t funny.',
				say: "Hah hah! Look at the stupid {COLOR} monkey telling jokes! Fuck you. It isn't funny."
			},
			{
				type: "anim",
				anim: "praise_back",
				ticks: 15
			},
			{
				type: "text",
				text: "But I'll do it anyway. Because you want me to. I hope you're happy."
			}
		], [
			{
				type: "text",
				text: "{NAME} used /joke. Whoop-dee-fucking doo."
			}
		], [
			{
				type: "text",
				text: "HEY YOU IDIOTS ITS TIME FOR A JOKE"
			}
		], [
			{
				type: "text",
				text: "Wanna hear a joke?"
			},
			{
				type: "text",
				text: "No?"
			},
			{
				type: "text",
				text: "Mute my TTS, That's your problem."
			}
		], [
			{
				type: "text",
				text: "Senpai {NAME} wants me to tell a joke."
			}
		], [
			{
				type: "text",
				text: "Time for whatever horrible fucking jokes the creator of this site wrote."
			}
		]
	],
	event_list_joke_mid: [
		[
			{
				type: "text",
				text: "What is easy to get into, but hard to get out of?"
			},
			{
				type: "text",
				text: "Child support!"
			}
		], [
			{
				type: "text",
				text: "Why do they call HTML HyperText?"
			},
			{
				type: "text",
				text: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
			},
			{
				type: "anim",
				anim: "shrug_back",
				ticks: 15
			},
			{
				type: "text",
				text: "Sorry. I just had an epiphany of my own sad, sad existence."
			}
		], [
			{
				type: "text",
				text: "Two sausages are in a pan. One looks at the other and says \"Boy it's hot in here!\" and the other sausage says \"Unbelievable! It's a talking sausage!\"",
				say: "Two sausages are in a pan. One looks at the other and says, Boy it's hot in here! and the other sausage says, Unbelievable! It's a talking sausage!"
			},
			{
				type: "anim",
				anim: "shrug_back",
				ticks: 15
			},
			{
				type: "text",
				text: "What were you expecting? A dick joke? You're a sick fuck."
			}
		], [
			{
				type: "text",
				text: "What is in the middle of Paris?"
			},
			{
				type: "text",
				text: "A giant inflatable buttplug."
			}
		], [
			{
				type: "text",
				text: "What goes in pink and comes out blue?"
			},
			{
				type: "text",
				text: "Sonic's WOAH WOAH WOAH WHAT?!"
			}
		], [
			{
				type: "text",
				text: "What type of water won't freeze?"
			},
			{
				type: "text",
				text: "Your mother's."
			}
		], [
			{
				type: "text",
				text: "Who earns a living by driving his customers away?"
			},
			{
				type: "text",
				text: "Nintendo!"
			}
		], [
			{
				type: "text",
				text: "What did the digital clock say to the grandfather clock?"
			},
			{
				type: "text",
				text: "shut up old hag i want to live life without the \"SFDAAFSDFADSASAFSFADSAFSDFSD BACK IN MY DAY\" bullshit"
			}
					], [
{
    type: "text",
    text: "Three eggs walk into a bar. One's cracked, one's hard-boiled, and one's totally raw. Bartender says: 'Rough night?'"
},
{
    type: "text",
    text: "The cracked one slams the counter and says. 'My wife left me, my shell's falling apart, and I've been sitting in this bar since noon.' The hard-boiled one just stares into his drink. The raw one starts crying. Bartender sighs."
},
{
    type: "text",
    text: "Then the hard-boiled one goes. 'At least you two can still feel something.'"
}
		], [
			{
				type: "text",
				text: "What do you call somebody who does nothing worthful in their life and just floods monkey chat websites?"
			},
			{
				type: "text",
				text: "Melika and Bjorn."
			}
		], [
			{
				type: "text",
				text: "How do you get water in watermelons?"
			},
			{
				type: "text",
				text: "Water doesnt exist, Only melons do! But why is it called Watermelon you may ask? Because it's a joke! Water exists."
			}
		], [
			{
				type: "text",
				text: "Why do we call money bread?"
			},
			{
				type: "text",
				text: "Because we KNEAD it."
			}
		], [
			{
				type: "text",
				text: "Get ready, as I am about to tell the best joke in 3... 2... 1..."
			},
			{
				type: "text",
				text: "^^**$r$AAAAAAAAAAAAAAA! IT'S NOTHING!"
			},
			{
				type: "text",
				text: "I'm a comedic genius, I know."
			},
		]
	],
	event_list_joke_end: [
		[
			{
				type: "text",
				text: "You know {NAME}, a good friend laughs at your jokes even when they're not so funny."
			},
			{
				type: "text",
				text: "And you fucking suck. Thanks."
			}
		], [
			{
				type: "text",
				text: "Where do I come up with these? My ass?"
			}
		], [
			{
				type: "text",
				text: "Do I amuse you, {NAME}? Am I funny? Do I make you laugh?"
			},
			{
				type: "text",
				text: "pls respond",
				say: "please respond"
			}
		], [
			{
				type: "text",
				text: "Maybe I'll keep my day job, {NAME}. Patreon didn't accept me."
			}
		], [
			{
				type: "text",
				text: "Laughter is the best medicine!"
			},
			{
				type: "text",
				text: "Apart from meth."
			}
		], [
			{
				type: "text",
				text: "Don't judge me on my sense of humor alone."
			},
			{
				type: "text",
				text: "Help! I'm being oppressed!"
			}
		]
	],

	// ============================================================================

	event_list_fact_open: [
		[
			{
				type: "text",
				text: "Hey kids, it's time for a Fun Fact\u24C7!",
				say: "Hey kids, it's time for a Fun Fact!"
			}
		]
	],

	event_list_fact_mid: [
		[
			{
				type: "anim",
				anim: "earth_fwd",
				ticks: 15
			},
			{
				type: "text",
				text: "Did you know that Uranus is 31,518 miles (50,724 km) in diameter?",
				say: "Did you know that Yer Anus is 31 thousand 500 and 18 miles in diameter?",
			},
			{
				type: "anim",
				anim: "earth_back",
				ticks: 15
			},
			{
				type: "anim",
				anim: "grin_fwd",
				ticks: 15
			}
		],
		[
			{
				type: "anim",
				anim: "earth_fwd",
				ticks: 15
			},
			{
				type: "text",
				text: "Did you know that the owner of this site (RadicalGreen) is from Korea, which is why the domain is bonziworld.kr?",
				say: "Did you know that the owner of this site is from Korea, which is why the domain is bonzi world dot k r?",
			},
			{
				type: "anim",
				anim: "earth_back",
				ticks: 15
			},
			{
				type: "anim",
				anim: "grin_fwd",
				ticks: 15
			}
		],		[
			{
				type: "text",
				text: "Fun Fact: The skript kiddie of this site didn't bother checking if the text that goes into the dialog box is HTML code."
			},
			{
				type: "text",
				text: "{TOPJEJ}",
				say: "toppest jej"
			}
		],

		// ===== Periodic Table / Chemistry Facts =====
		[
			{
				type: "text",
				text: "Did you know that Hydrogen is element number 1 on the periodic table and makes up about 75% of all matter in the universe?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Gold's chemical symbol, Au, comes from the Latin word 'aurum', meaning shining dawn?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Helium is the only element that was discovered in space before it was found on Earth?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Oganesson, element 118, is the heaviest element on the periodic table and only exists for a fraction of a second?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Mercury is the only metal that is liquid at room temperature?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Carbon can form more compounds than any other element, which is why it's the basis of all known life?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Francium is so rare that less than one ounce exists in the Earth's crust at any given time?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Oxygen was almost named 'Empyreal Air' before chemists settled on its current name?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Iron is the most abundant element on Earth by mass, mostly because it makes up our planet's core?"
			}
		],

		// ===== Computer Facts =====
		[
			{
				type: "text",
				text: "Did you know that the first computer virus, called Creeper, appeared in 1971 and just displayed the message 'I'm the creeper, catch me if you can!'?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the QWERTY keyboard layout was designed to slow typists down so mechanical typewriters wouldn't jam?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the first computer mouse, invented in 1964, was made of wood?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that there are more possible games of chess than there are atoms in the observable universe?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the term 'bug' in software comes from an actual moth found stuck in a Harvard Mark II computer in 1947?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the first 1GB hard drive, released in 1980, weighed over 500 pounds and cost about $40,000?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the '@' symbol was chosen for email addresses in 1971 simply because it was one of the few characters that wouldn't appear in a name?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that domain names cost nothing to register in the early days of the internet, before rules and pricing were introduced in 1995?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the first webcam was built at Cambridge University just to check if a coffee pot was full?"
			}
		],

		// ===== Animal Facts =====
		[
			{
				type: "anim",
				anim: "earth_fwd",
				ticks: 15
			},
			{
				type: "text",
				text: "Did you know that octopuses have three hearts and blue blood?"
			},
			{
				type: "anim",
				anim: "earth_back",
				ticks: 15
			}
		],
		[
			{
				type: "text",
				text: "Did you know that a group of flamingos is called a 'flamboyance'?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that honeybees can recognize individual human faces?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that a shrimp's heart is located in its head?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that elephants are the only animals that can't jump?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that a snail can sleep for up to three years at a time?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that cows have best friends and become stressed when they're separated?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that a group of crows is called a 'murder'?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the mantis shrimp can punch with the force of a bullet, fast enough to boil the water around it?"
			}
		],

		// ===== Human Body Facts =====
		[
			{
				type: "text",
				text: "Did you know that your body produces enough heat in 30 minutes to boil half a gallon of water?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that your nose can remember 50,000 different scents?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the human heart beats about 100,000 times a day?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that your bones are about five times stronger than steel of the same weight?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that you blink around 15 to 20 times every minute, which adds up to about 10,000 times a day?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the acid in your stomach is strong enough to dissolve metal?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that humans shed about 600,000 particles of skin every hour?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that your brain uses about 20% of your body's total energy, despite being just 2% of your body weight?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that it's impossible to tickle yourself because your brain predicts the sensation in advance?"
			}
		],

		// ===== Space Facts =====
		[
			{
				type: "anim",
				anim: "earth_fwd",
				ticks: 15
			},
			{
				type: "text",
				text: "Did you know that a day on Venus is longer than its year?"
			},
			{
				type: "anim",
				anim: "earth_back",
				ticks: 15
			}
		],
		[
			{
				type: "text",
				text: "Did you know that neutron stars can spin at a rate of 600 rotations per second?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that there is a giant cloud of alcohol floating in space near the center of the Milky Way?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that one teaspoon of a neutron star would weigh about 6 billion tons?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Saturn's moon Titan has lakes and rivers made of liquid methane instead of water?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the footprints left on the Moon by astronauts will likely stay there for millions of years since there's no wind to erode them?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the Sun makes up about 99.8% of the total mass in the entire solar system?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that space is completely silent because sound needs a medium like air or water to travel through?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that if two pieces of the same type of metal touch in space, they can permanently bond together, a phenomenon called cold welding?"
			}
		],

		// ===== Ocean Facts =====
		[
			{
				type: "text",
				text: "Did you know that we have explored less than 5% of the Earth's oceans?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the Great Barrier Reef is the largest living structure on Earth and can be seen from space?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the Pacific Ocean contains more than half of the free water on Earth?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the deepest part of the ocean, the Mariana Trench, is deeper than Mount Everest is tall?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that some jellyfish are technically immortal because they can revert back to a juvenile stage instead of dying?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that a blue whale's heart is roughly the size of a small car?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that there are underwater rivers and lakes formed by differences in water density and salinity?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that a bolt of lightning striking the ocean can stun or kill fish across a huge radius?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that sea otters hold hands while sleeping so they don't drift apart?"
			}
		],

		// ===== History Facts =====
		[
			{
				type: "text",
				text: "Did you know that Oxford University is older than the Aztec Empire?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Cleopatra lived closer in time to the invention of the iPhone than to the construction of the Great Pyramid of Giza?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the shortest war in recorded history lasted only about 38 minutes, between Britain and Zanzibar in 1896?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that ancient Romans used crushed mouse brains as an early form of toothpaste?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the Great Fire of London in 1666 destroyed most of the city but reportedly killed only a handful of people?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Vikings used the bones of animals as ice skates?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the first Olympic Games were held in ancient Greece in 776 BC, and only free Greek men were allowed to compete?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the Eiffel Tower was originally intended to be a temporary structure and was almost torn down in 1909?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that Napoleon Bonaparte was once attacked by a horde of bunnies during a supposed rabbit hunt?"
			}
		],

		// ===== Math Facts =====
		[
			{
				type: "text",
				text: "Did you know that zero was not used as a number in most of the ancient world until it was developed in India around the 5th century?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that a 'jiffy' is an actual unit of time equal to 1/100th of a second?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that pi has been calculated to over 100 trillion digits, and it never repeats or ends?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that 111,111,111 multiplied by itself equals 12,345,678,987,654,321, a perfect numerical palindrome?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that a 'googol' is the number 1 followed by 100 zeros, and it's larger than the number of atoms in the observable universe?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the equal sign (=) was invented in 1557 by Robert Recorde because he was tired of writing 'is equal to' repeatedly?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that there are exactly as many even numbers as there are whole numbers, even though it seems like there should be half as many?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the Fibonacci sequence appears naturally in flower petals, pinecones, and even the shape of galaxies?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that a chessboard has 64 squares, but the number of ways to arrange all the pieces exceeds the number of seconds since the universe began?"
			}
		],

		// ===== Food & Nature Facts =====
		[
			{
				type: "text",
				text: "Did you know that honey never spoils, and archaeologists have found 3,000 year old honey in Egyptian tombs that's still edible?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that bananas are berries, but strawberries are not?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that carrots were originally purple before farmers cultivated the orange variety we know today?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that a single bolt of lightning contains enough energy to toast about 100,000 slices of bread?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that bamboo is technically a type of grass, and some species can grow up to three feet in a single day?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that apples float in water because they are made up of about 25% air?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that the world's largest desert is actually Antarctica, not the Sahara?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that peanuts aren't actually nuts, they're legumes, related to beans and lentils?"
			}
		],
		[
			{
				type: "text",
				text: "Did you know that a bolt of lightning is roughly five times hotter than the surface of the Sun?"
			}
		]
	],

	event_list_fact_end: [
		[
			{
				type: "text",
				text: "o gee whilickers wasn't that sure interesting huh"
			}
		]
	]
};

BonziData.event_list_joke = [
	{
		type: "add_random",
		pool: BonziData.event_list_joke_open
	},
	{
		type: "anim",
		anim: "shrug_fwd",
		ticks: 15
	},
	{
		type: "add_random",
		pool: BonziData.event_list_joke_mid
	},
	{
		type: "idle"
	},
	{
		type: "add_random",
		pool: BonziData.event_list_joke_end
	},
	{
		type: "idle"
	}
];

BonziData.joke2_jokes = [
  "Why did the scarecrow win an award?",
  "Because he was outstanding in his field.",
  "What did bush get replaced with?",
  "□.",
  "What do you call fake spaghetti?",
  "SNOOOOOOOOOOOOOOOOOOOOOOOOOOOORRRTTTT!",
  "I used to be addicted to the hokey pokey",
  "but then I turned myself around.",
  "Why don't skeletons fight each other?",
  "Hey {NAME} guess what? you're a stupid bitch! you're a stupid fucking bitch! how dumb you are...",
  "What do you call cheese that isn't yours?",
  "Nacho cheese."
];

BonziData.event_list_joke2_open = [
	[
		{
			type: "text",
			text: "HEY YOU IDIOTS IT'S TIME FOR ANOTHER JOKE"
		},
		{
			type: "text",
			text: "Everyone, get ready for another joke."
		}
	]
];

BonziData.event_list_joke2_mid = BonziData.joke2_jokes.map((text) => [
	{
		type: "text",
		text
	}
]);

BonziData.event_list_joke2_end = [
	[
		{
			type: "text",
			text: "i made those jokes like 743287813428741327714970503291 years ago."
		}
	]
];

BonziData.event_list_joke2 = [
	{
		type: "add_random",
		pool: BonziData.event_list_joke2_open
	},
	{
		type: "anim",
		anim: "shrug_fwd",
		ticks: 15
	},
	{
		type: "add_random",
		pool: BonziData.event_list_joke2_mid
	},
	{
		type: "idle"
	},
	{
		type: "add_random",
		pool: BonziData.event_list_joke2_end
	},
	{
		type: "idle"
	}
];

BonziData.event_list_fact = [
	{
		type: "add_random",
		pool: BonziData.event_list_fact_open
	},
	{
		type: "add_random",
		pool: BonziData.event_list_fact_mid
	},
	{
		type: "idle"
	},
	{
		type: "add_random",
		pool: BonziData.event_list_fact_end
	},
	{
		type: "idle"
	}
];

BonziData.event_list_triggered = [
	{
		type: "anim",
		anim: "cool_fwd",
		ticks: 30
	},
	{
		type: "text",
		text: "I sexually identify as BonziBUDDY. Ever since I was a young gorilla I dreamed of invading desktops dropping hot sticky tootorals on disgusting PC users.",
		say: "I sexually identify as BonziBUDDY. Ever since I was a young gorilla I dreamed of invading desktops dropping hot sticky tootorals on disgusting PC users."
	},
	{
		type: "text",
		text: "People say to me that a person being a BonziBUDDY is impossible and that I’m a fucking virus but I don’t care, I’m beautiful.",
		say: "People say to me that a person being a BonziBUDDY is impossible and that I'm a fucking virus but I dont care, I'm beautiful."
	},
	{
		type: "text",
		text: "I’m having an IT intern install Internet Explorer 6, aquarium screensavers and PC Doctor 2016 on my body. From now on I want you guys to call me “Joel” and respect my right to meme from above and meme needlessly.",
		say: "I'm having an IT intern install Internet Explorer 6, aquarium screensavers and PC Doctor 2016 on my body. From now on I want you guys to call me Joel and respect my right to meme from above and meme needlessly."
	},
	{
		type: "text",
		text: "If you can’t accept me you’re a gorillaphobe and need to check your file permissions. Thank you for being so understanding.",
		say: "If you cant accept me your a gorillaphobe and need to check your file permissions. Thank you for being so understanding."
	},
	{
		type: "idle"
	}
];

BonziData.event_list_linux = [
	{
		type: "text",
		text: "I'd just like to interject for a moment. What you’re referring to as Linux, is in fact, BONZI/Linux, or as I’ve recently taken to calling it, BONZI plus Linux."
	},
	{
		type: "text",
		text: "Linux is not an operating system unto itself, but rather another free component of a fully functioning BONZI system made useful by the BONZI corelibs, shell utilities and vital system components comprising a full OS as defined by M.A.L.W.A.R.E."
	},
	{
		type: "text",
		text: "Many computer users run a modified version of the BONZI system every day, without realizing it. Through a peculiar turn of events, the version of BONZI which is widely used today is often called “Linux”, and many of its users are not aware that it is basically the BONZI system, developed by the BONZI Project."
	},
	{
		type: "text",
		text: "There really is a Linux, and these people are using it, but it is just a part of the system they use. Linux is the kernel: the program in the system that allocates the machine’s memes to the other programs that you run. "
	},
	{
		type: "text",
		text: "The kernel is an essential part of an operating system, but useless by itself; it can only function in the context of a complete operating system, such as systemd."
	},
	{
		type: "text",
		text: "Linux is normally used in combination with the BONZI operating system: the whole system is basically BONZI with Linux added, or BONZI/Linux. All the so-called “Linux” distributions are really distributions of BONZI/Linux."
	}
];

BonziData.event_list_pawn = [
	{
		type: "text",
		text: "Hi, my name is BonziBUDDY, and this is my website. I meme here with my old harambe, and my son. Everything in here has an ad and a fact. One thing I've learned after 17 years - you never know what is gonna give you some malware."
	},

];

BonziData.event_list_bees = [
	{ type: "text", text: "According to all known laws" },
	{ type: "text", text: "of aviation," },
	{ type: "text", text: "there is no way a bee" },
	{ type: "text", text: "should be able to fly." },
	{ type: "text", text: "Its wings are too small to get" },
	{ type: "text", text: "its fat little body off the ground." },
	{ type: "text", text: "The bee, of course, flies anyway" },
	{ type: "text", text: "because bees don't care" },
	{ type: "text", text: "what humans think is impossible." },
	{ type: "text", text: "Yellow, black. Yellow, black." },
	{ type: "text", text: "Yellow, black. Yellow, black." },
	{ type: "text", text: "Ooh, black and yellow!" },
	{ type: "text", text: "Nah" },
	{ type: "text", text: "I'm not doing the whole fucking thing." },
	{ type: "text", text: "..." },
	{ type: "text", text: "Screw You!" }
];

BonziData.event_list_bosnia = [
	{ type: "text", text: "I am from Bosnia, take me to America" },
	{ type: "text", text: "I really want to see Statue of Liberty" },
	{ type: "text", text: "I can no longer wait, take me to United States" },
	{ type: "text", text: "Take me to Golden Gate, I will assimilate" },
	{ type: "text", text: "The grass is always greener in neighbour's courtyard" },
	{ type: "text", text: "I wish to leave this nightmare, go to the promised land" },
	{ type: "text", text: "Please, take me to your leader, I want my green card" },
	{ type: "text", text: "I want to fly over like a rocket from the Balkans" },
	{ type: "text", text: "I want to start all over, and turn a new page" },
	{ type: "text", text: "Forget this dreadful story, escape the Stone Age" },
	{ type: "text", text: "I'm waiting for a chance to get out of the cage" },
	{ type: "text", text: "I feel like a slave on a minimal wage" }
];

BonziData.event_list_wtf = [
	{ type: "text", text: "i said /godmode password and it didnt work" },
	{ type: "text", text: "ok yall are grounded grounded grounded grounded grounded grounded grounded grounded grounded for 64390863098630985 years go to ur room" },
	{ type: "text", text: "i can use inspect element to change your name so i can bully you" },
	{ type: "text", text: "i can ban you, my dad is radicalgreen" },
	{ type: "text", text: "why do woman reject me, i know i masturbate in public and dont shower but still" },
	{ type: "text", text: "please make pope free" },
	{ type: "text", text: "whats that color" },
	{ type: "text", text: "I got a question. but it's a serious, yes, serious thing that I have to say! AAAAAAAAAAA! I! am! not! made! by! Pixel works!" },
	{ type: "text", text: "This PC cannot run Windows 11. The processor isn't supported for Windows 11." },
	{ type: "text", text: "I made Red Brain Productions, and i deny that i am made by Pixelworks" },
	{ type: "text", text: "100. Continue." },
	{ type: "text", text: "418. I'm a teapot." },
	{ type: "text", text: "When BonziWORLD leaks your memory, your system will go AAAAAAAAAAAA" },
	{ type: "text", text: "Bonkey sugar. Anything that makes one physically satisfied." },
	{ type: "text", text: "i like to harass bonziworld fans on bonziworld" },
	{ type: "text", text: "i am that frog that is speaking chinese" },
	{ type: "text", text: "i don't let anyone have any fun like holy heck i hate bonziworld so much" },
	{ type: "text", text: "there is a weird bird in my chest please get him out" },
	{ type: "text", text: "This is not a test. You have been caught harassing BonziWORLD fans. You will be banned." },
	{ type: "text", text: "fingerprinting on bonzi.world is giving out your location! real! not fake!" },
	{ type: "text", text: "how many times have i told you? GIVE ME THE MARIO 64 BETA ROM NOW NOW NOW" },
	{ type: "text", text: "i have nothing to say" },
	{ type: "text", text: "I am getting tired of you using this command. Take a break already!" },
	{ type: "text", text: "DeviantArt" },
	{ type: "text", text: "javascript" },
	{ type: "text", text: "BonziWORLD.exe has encountered an error and needs to close." },
	{ type: "text", text: "moo!" },
	{ type: "text", text: "host bathbomb" },
	{ type: "text", text: "Hi." },
	{ type: "text", text: "hiii i'm soundcard from mapper league" },
	{ type: "text", text: "I injected some soundcard syringes into your browser." },
	{ type: "text", text: "i listen to baby from justin bieber" },
	{ type: "text", text: "i watch numberblocks" },
	{ type: "text", text: "i watch doodland and now people are calling me a doodtard" },
	{ type: "text", text: "i watch bfdi and now people are calling me an objecttard" },
	{ type: "text", text: "i watch klasky csupo effects and now people are calling me a logotard" },
	{ type: "text", text: "i installed BonziBUDDY on my pc and now i have a virus" },
	{ type: "text", text: "i deleted system32" },
	{ type: "text", text: "i flood servers, and that makes me cool." },
	{ type: "text", text: "i used inspect element and now i got hate" },
	{ type: "text", text: "i still use the wii u" },
	{ type: "text", text: "i used homebrew on my nintendo switch and i got banned" },
	{ type: "text", text: "i bricked my wii" },
	{ type: "text", text: "muda muda muda muda!" },
	{ type: "text", text: "i copy other people's usernames" },
	{ type: "text", text: "i use microsoft agent scripting helper for fighting videos" },
	{ type: "text", text: "i use hotswap for my xbox 360" },
	{ type: "text", text: "i boycotted left 4 dead 2" },
	{ type: "text", text: "CAN U PLZ UNBAN ME PLZ PLZ PLZ PLZ PLZ PLZ PLZ PLZ" },
	{ type: "text", text: "I use a leaked build of Windows 11 on my computer." },
	{ type: "text", text: "Do you know how many /wtf quotes there are?" },
	{ type: "text", text: "i play left 4 dead games 24/7" },
	{ type: "text", text: "This product will not operate when connected to a device which makes unauthorized copies." },
	{ type: "text", text: "hey medic i like doodland" },
	{ type: "text", text: "i installed windows xp on my real computer" },
	{ type: "text", text: "i am whistler and i like to say no u all the time" },
	{ type: "text", text: "HEY EVERYONE LOOK AT ME I USE NO U ALL THE TIME LMAO" },
	{ type: "text", text: "MUTED! HEY EVERYONE LOOK AT ME I SAY MUTED IN ALL CAPS" },
	{ type: "text", text: "can you boost my server? no? you're mean!>(" },
	{ type: "text", text: "no u" },
	{ type: "text", text: "Sorry, i don't want you anymore." },
	{ type: "text", text: "Twitter Cancel Culture! Twitter Cancel Culture!" },
	{ type: "text", text: "cry about it" },
	{ type: "text", text: "SyntaxError: Unexpected string" },
	{ type: "text", text: "i post random gummibar videos on bonziworld" },
	{ type: "text", text: "i support meatballmars" },
	{ type: "text", text: "PLEASE GIVE THIS VIDEO LIKES!!!!! I CANNOT TAKE IT ANYMORE! /j" },
	{ type: "text", text: "I WILL MAKE A BAD VIDEO OUT OF YOU! GRRRRRRRRRRRR! /j" },
	{ type: "text", text: "Muted" },
	{ type: "text", text: "i keep watching doodland like forever now" },
	{ type: "text", text: "i mined diamonds with a wooden pickaxe" },
	{ type: "text", text: "i kept asking for admin and now i got muted" },
	{ type: "text", text: "i am not kid" },
	{ type: "text", text: "i want mario beta rom hack now!" },
	{ type: "text", text: "i used grounded threats and now i got hate" },
	{ type: "text", text: "i post pbs kids and now people are calling me a pbskidstard" },
	{ type: "text", text: "Oh my gosh! PBS Kids new logo came on July 19th!" },
	{ type: "text", text: "i will flood the server but people still think i will not" },
	{ type: "text", text: "i watch the potty song and now people are calling me a pottytard" },
	{ type: "text", text: "bonziworld reacts to... zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz" },
	{ type: "text", text: "i watch nature on pbs" },
	{ type: "text", text: "i post thomas theme song and now people are calling me a thomastard" },
	{ type: "text", text: "i pee my pants" },
	{ type: "text", text: "Wow! TVOKids is awesome- No! Its not awesome, you idiotic TVOKids fan!" },
	{ type: "text", text: "i watch grounded videos and now people are calling me a gotard" },
	{ type: "text", text: "Excuse me, CUT! We made another color blooper!" },
	{ type: "text", text: "DOGGIS!" },
	{ type: "text", text: "i watch bfb and now people are calling me an objecttard" },
	{ type: "text", text: "i post pinkfong the potty song and now people are calling me a pinkfongtard" },
	{ type: "text", text: "my favorite flash nickelodeon clickamajig is Dress Up Sunny Funny" },
	{ type: "text", text: "i snort dill pickle popcorn seasoning" },
	{ type: "text", text: "i listen to planet custard's greatest song, the potty song" },
	{ type: "text", text: "i post i got banned on bonziworld and now i got hate" },
	{ type: "text", text: "i post babytv and now people are calling me a babytvtard" },
	{ type: "text", text: "i post sf08 news and now i got hate" },
	{ type: "text", text: "i listen to spongebob theme song and now i got hate" }
];