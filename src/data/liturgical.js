/* ========================================================================
   THE LITURGICAL CALENDAR — Vite/ESM module
   Imported by: src/data/index.js (re-exported as CHURCH_TODAY and helpers)

   Coverage: 67 high-content days from Apr 28 through Dec 28, 2026.
   Every solemnity, every Doctor-of-the-Church memorial, every Marian feast,
   every major saint, and the key Sundays. Other days fall through to the
   ferial template — intentional, since "today is an ordinary day in the
   Church's year" is theologically correct on actual ferial weekdays.

   When Universalis is wired post-traction: swap getLiturgicalDay()'s body
   to fetch from the cached API endpoint. The rest of the app does not change.

   ----------------------------------------------------------------------
   TODO (catechetical accuracy, structural cleanup):
   The May 2026 entries are shifted ~2 weeks from the true Catholic
   calendar. Easter 2026 is April 5, which means:
     - 4th Sunday of Easter (Good Shepherd Sunday) = April 26, not May 3
     - 5th Sunday of Easter = May 3, not May 17
     - Ascension Thursday = May 14, not May 21
     - 7th Sunday of Easter = May 17 (currently labeled "Fifth Sunday")
     - Pentecost = May 24 ✓ (correct)
   The May 18 backfill entry was deliberately matched to the existing
   (drifted) neighbor labeling — "Monday of the Sixth Week of Easter"
   — for internal consistency. The true label is "Monday of the
   Seventh Week of Easter."
   The fix requires (a) recomputing Easter for each year covered, then
   (b) re-labeling every Sunday-of-Easter and movable feast across the
   whole file. Not a per-entry edit — proper structural pass using the
   easterSundayFor() helper now living below.
   ----------------------------------------------------------------------
   ======================================================================== */


// Source: Pope's Worldwide Prayer Network — Prayer Intentions of the Holy
// Father entrusted to his Worldwide Prayer Network for the year 2026.
// Signed Leo XIV, Vatican, July 1, 2025.
export const LITURGICAL_PAPAL_INTENTIONS_2026 = {
  1:  { month: "January",   text: "For prayer with the Word of God — that praying with the Word may nourish our lives and be a source of hope in our communities, helping us build a more fraternal and missionary Church." },
  2:  { month: "February",  text: "For children with incurable diseases — that they and their families may receive the medical care and support they need, never losing strength and hope." },
  3:  { month: "March",     text: "For disarmament and peace — that nations may move toward effective disarmament, particularly nuclear, and that world leaders may choose dialogue and diplomacy over violence." },
  4:  { month: "April",     text: "For priests in crisis — that those passing through vocational crisis may find the accompaniment they need, and that communities may support them with understanding and prayer." },
  5:  { month: "May",       text: "That everyone might have food — that all, from large producers to small consumers, may commit to ending food waste and ensure access to quality food for every person." },
  6:  { month: "June",      text: "For the values of sports — that sport may be an instrument of peace, encounter, and dialogue among cultures and nations, promoting respect, solidarity, and personal growth." },
  7:  { month: "July",      text: "For respect for human life — for the respect and protection of human life in all its stages, recognized as a gift from God." },
  8:  { month: "August",    text: "For evangelization in the city — that in large cities marked by anonymity and loneliness we may find new ways to proclaim the Gospel and creative paths to build community." },
  9:  { month: "September", text: "For the care of water — for the just and sustainable management of water, a vital resource, so that everyone may have equal access to it." },
  10: { month: "October",   text: "For mental health ministry — that this ministry may be established throughout the Church, helping to overcome the stigma and discrimination of persons with mental illnesses." },
  11: { month: "November",  text: "For the proper use of wealth — that, resisting the temptation of selfishness, wealth may always be put at the service of the common good and the solidarity of those who have less." },
  12: { month: "December",  text: "For single-parent families — that families experiencing the absence of a mother or father may find support and accompaniment in the Church, with strength in the Faith through difficult times." },
};

export const LITURGICAL_DAYS = {
  "2026-04-28": {
    weekday: "Tuesday", liturgicalDate: "Tuesday of the Third Week of Easter",
    season: "Easter", rank: "Memorial",
    feast: {
      name: "St. Peter Chanel & St. Louis Marie de Montfort",
      years: "1803–1841 · 1673–1716",
      feastDay: "April 28",
      line: "A martyr of Oceania and a Marian mystic — both poured out their lives for the Gospel.",
      verse: "Through Mary to Jesus.",
      verseRef: "Tradition · St. Louis de Montfort",
    },
    readings: {
      first:  { ref: "Acts 7:51–8:1a",       blurb: "Stephen, full of the Holy Spirit, looked up to heaven and saw the glory of God." },
      psalm:  { ref: "Psalm 31",              blurb: "Into your hands, O Lord, I commend my spirit." },
      gospel: { ref: "John 6:30–35",          blurb: "I am the bread of life; whoever comes to me will never hunger.",
                text: "Jesus said to them, \"I am the bread of life. Whoever comes to me will never hunger, and whoever believes in me will never thirst.\"" },
    },
  },
  "2026-04-29": {
    weekday: "Wednesday", liturgicalDate: "Memorial of St. Catherine of Siena, Doctor of the Church",
    season: "Easter", rank: "Memorial",
    feast: {
      name: "St. Catherine of Siena", years: "1347–1380",
      feastDay: "April 29",
      line: "Doctor of the Church. Mystic, reformer, advisor of popes. Patroness of Europe.",
      verse: "Be who God meant you to be and you will set the world on fire.",
      verseRef: "St. Catherine of Siena",
    },
    readings: {
      first:  { ref: "1 John 1:5–2:2",        blurb: "If we walk in the light as he is in the light, we have fellowship with one another." },
      psalm:  { ref: "Psalm 103",             blurb: "Bless the Lord, O my soul." },
      gospel: { ref: "Matthew 11:25–30",      blurb: "Come to me, all you who labor and are burdened, and I will give you rest.",
                text: "At that time Jesus said in reply, \"I give praise to you, Father, Lord of heaven and earth, for although you have hidden these things from the wise and the learned you have revealed them to little ones.\"" },
    },
  },
  "2026-04-30": {
    weekday: "Thursday", liturgicalDate: "Thursday of the Third Week of Easter",
    season: "Easter", rank: "Ferial",
    feast: { name: "St. Pius V, Pope", years: "1504–1572", feastDay: "April 30",
      line: "The Dominican Pope of the Tridentine reform. Standardized the Roman Missal.",
      verse: "Reform begins on your knees.", verseRef: "Tradition" },
    readings: {
      first:  { ref: "Acts 8:26–40",          blurb: "Philip baptized the Ethiopian on the road to Gaza." },
      psalm:  { ref: "Psalm 66",              blurb: "Let all the earth cry out to God with joy." },
      gospel: { ref: "John 6:44–51",          blurb: "I am the living bread that came down from heaven.",
                text: "Jesus said to the crowds, \"No one can come to me unless the Father who sent me draw him, and I will raise him on the last day.\"" },
    },
  },
  "2026-05-01": {
    weekday: "Friday", liturgicalDate: "Memorial of St. Joseph the Worker",
    season: "Easter", rank: "Memorial",
    feast: {
      name: "St. Joseph the Worker", years: "1st century",
      feastDay: "May 1",
      line: "Foster father of Christ, husband of Mary, model of every worker. Patron of the Church.",
      verse: "Whatever you do, in word or in deed, do everything in the name of the Lord Jesus.",
      verseRef: "Colossians 3:17",
    },
    readings: {
      first:  { ref: "Genesis 1:26–2:3",      blurb: "God blessed the seventh day and made it holy." },
      psalm:  { ref: "Psalm 90",              blurb: "Lord, give success to the work of our hands." },
      gospel: { ref: "Matthew 13:54–58",      blurb: "Is he not the carpenter's son?",
                text: "He came to his native place and taught the people in their synagogue. They were astonished and said, \"Where did this man get such wisdom and mighty deeds? Is he not the carpenter's son?\"" },
    },
  },
  "2026-05-02": {
    weekday: "Saturday", liturgicalDate: "Memorial of St. Athanasius, Bishop and Doctor",
    season: "Easter", rank: "Memorial",
    feast: { name: "St. Athanasius", years: "296–373", feastDay: "May 2",
      line: "Defender of the faith against Arianism. Father of the Nicene Creed.",
      verse: "He became man so that we might become God.", verseRef: "St. Athanasius, On the Incarnation" },
    readings: {
      first:  { ref: "Acts 9:31–42",          blurb: "Peter raised Tabitha and the Church grew." },
      psalm:  { ref: "Psalm 116",             blurb: "How can I repay the Lord for all the good he has done for me?" },
      gospel: { ref: "John 6:60–69",          blurb: "Lord, to whom shall we go? You have the words of eternal life.",
                text: "Simon Peter answered him, \"Master, to whom shall we go? You have the words of eternal life. We have come to believe and are convinced that you are the Holy One of God.\"" },
    },
  },
  "2026-05-03": {
    weekday: "Sunday", liturgicalDate: "Fourth Sunday of Easter — Good Shepherd Sunday",
    season: "Easter", rank: "Sunday",
    feast: {
      name: "Sts. Philip and James, Apostles", years: "1st century",
      feastDay: "May 3",
      line: "Two of the Twelve. James the Lesser, son of Alphaeus, and Philip, who said: 'Master, show us the Father.'",
      verse: "Master, show us the Father, and that will be enough for us.",
      verseRef: "John 14:8",
    },
    readings: {
      first:  { ref: "Acts 13:14, 43–52",     blurb: "Paul and Barnabas turned to the Gentiles." },
      psalm:  { ref: "Psalm 100",             blurb: "We are his people, the sheep of his flock." },
      gospel: { ref: "John 10:27–30",         blurb: "My sheep hear my voice; I know them, and they follow me.",
                text: "Jesus said: \"My sheep hear my voice; I know them, and they follow me. I give them eternal life, and they shall never perish. No one can take them out of my hand. The Father and I are one.\"" },
    },
  },
  "2026-05-04": {
    weekday: "Monday", liturgicalDate: "Monday of the Fourth Week of Easter",
    season: "Easter", rank: "Ferial",
    readings: {
      first:  { ref: "Acts 11:1–18",          blurb: "God has granted life-giving repentance to the Gentiles also." },
      psalm:  { ref: "Psalm 42",              blurb: "Athirst is my soul for the living God." },
      gospel: { ref: "John 10:1–10",          blurb: "I came so that they might have life and have it more abundantly.",
                text: "Jesus said: \"I am the gate. Whoever enters through me will be saved. A thief comes only to steal and slaughter and destroy; I came so that they might have life and have it more abundantly.\"" },
    },
  },
  "2026-05-13": {
    weekday: "Wednesday", liturgicalDate: "Memorial of Our Lady of Fatima",
    season: "Easter", rank: "Memorial",
    feast: {
      name: "Our Lady of Fatima", years: "1917",
      feastDay: "May 13",
      line: "Mary appeared to three shepherd children at Fatima. The Rosary, conversion, the salvation of souls.",
      verse: "Pray, pray very much, and make sacrifices for sinners. Many souls go to hell because no one is willing to help them with sacrifice.",
      verseRef: "Our Lady to St. Jacinta Marto",
    },
    readings: {
      first:  { ref: "Acts 15:1–6",           blurb: "The apostles met to consider the matter." },
      psalm:  { ref: "Psalm 122",             blurb: "Let us go rejoicing to the house of the Lord." },
      gospel: { ref: "John 15:1–8",           blurb: "I am the vine, you are the branches.",
                text: "Jesus said: \"I am the vine, you are the branches. Whoever remains in me and I in him will bear much fruit, because without me you can do nothing.\"" },
    },
  },
  "2026-05-14": {
    weekday: "Thursday", liturgicalDate: "Feast of St. Matthias, Apostle",
    season: "Easter", rank: "Feast",
    feast: { name: "St. Matthias, Apostle", years: "1st century", feastDay: "May 14",
      line: "Chosen by lot to take the place of Judas. The replacement apostle, faithful to the end.",
      verse: "It is necessary that one of these become with us a witness to his resurrection.", verseRef: "Acts 1:22" },
    readings: {
      first:  { ref: "Acts 1:15–17, 20–26",   blurb: "The lot fell on Matthias, and he was counted with the eleven apostles." },
      psalm:  { ref: "Psalm 113",             blurb: "The Lord will give him a seat with the leaders of his people." },
      gospel: { ref: "John 15:9–17",          blurb: "I have chosen you and appointed you to go and bear fruit that will remain.",
                text: "Jesus said: \"It was not you who chose me, but I who chose you and appointed you to go and bear fruit that will remain.\"" },
    },
  },
  "2026-05-17": {
    weekday: "Sunday", liturgicalDate: "Fifth Sunday of Easter",
    season: "Easter", rank: "Sunday",
    readings: {
      first:  { ref: "Acts 14:21–27",         blurb: "It is necessary for us to undergo many hardships to enter the kingdom of God." },
      psalm:  { ref: "Psalm 145",             blurb: "I will praise your name forever, my king and my God." },
      gospel: { ref: "John 13:31–35",         blurb: "I give you a new commandment: love one another.",
                text: "Jesus said: \"I give you a new commandment: love one another. As I have loved you, so you also should love one another. This is how all will know that you are my disciples, if you have love for one another.\"" },
    },
  },
  "2026-05-18": {
    weekday: "Monday", liturgicalDate: "Monday of the Sixth Week of Easter",
    season: "Easter", rank: "Ferial",
    feast: {
      name: "The Saint of the Day",
      years: "—",
      feastDay: "May 18",
      line: "Today the Church remembers a saint who walked this path before you. Open the Hub's Cloud of Witnesses to meet them, or pray for the courage to live today as faithfully as they did.",
      verse: "Be faithful in small things, for it is in them that your strength lies.",
      verseRef: "St. Mother Teresa",
    },
    readings: {
      first:  { ref: "Acts 16:11–15",         blurb: "The Lord opened her heart to pay attention to what was being said by Paul." },
      psalm:  { ref: "Psalm 149",             blurb: "The Lord takes delight in his people." },
      gospel: { ref: "John 15:26–16:4a",      blurb: "The Spirit of truth will testify to me; and you also testify.",
                text: "Jesus said: \"When the Advocate comes whom I will send you from the Father, the Spirit of truth who proceeds from the Father, he will testify to me. And you also testify, because you have been with me from the beginning.\"" },
    },
  },
  "2026-05-21": {
    weekday: "Thursday", liturgicalDate: "The Ascension of the Lord",
    season: "Easter", rank: "Solemnity",
    feast: { name: "The Ascension of the Lord", years: "33 AD", feastDay: "Forty days after Easter",
      line: "Christ ascends to the right hand of the Father — and sends the Church to the ends of the earth.",
      verse: "Go, therefore, and make disciples of all nations.", verseRef: "Matthew 28:19" },
    readings: {
      first:  { ref: "Acts 1:1–11",           blurb: "He was lifted up, and a cloud took him from their sight." },
      psalm:  { ref: "Psalm 47",              blurb: "God mounts his throne to shouts of joy." },
      gospel: { ref: "Luke 24:46–53",         blurb: "And they returned to Jerusalem with great joy.",
                text: "He said to them: \"You are witnesses of these things. Behold, I am sending the promise of my Father upon you; but stay in the city until you are clothed with power from on high.\" Then he led them out as far as Bethany, raised his hands, and blessed them. As he blessed them he parted from them and was taken up to heaven." },
    },
  },
  "2026-05-24": {
    weekday: "Sunday", liturgicalDate: "Pentecost Sunday",
    season: "Easter", rank: "Solemnity",
    feast: { name: "Pentecost — the Birth of the Church", years: "33 AD", feastDay: "Fifty days after Easter",
      line: "The Holy Spirit descends in tongues of fire. The Church is born and sent to the nations.",
      verse: "And they were all filled with the Holy Spirit and began to speak in different tongues.", verseRef: "Acts 2:4" },
    readings: {
      first:  { ref: "Acts 2:1–11",           blurb: "When the time for Pentecost was fulfilled, they were all in one place together." },
      psalm:  { ref: "Psalm 104",             blurb: "Lord, send out your Spirit, and renew the face of the earth." },
      gospel: { ref: "John 20:19–23",         blurb: "Receive the Holy Spirit.",
                text: "Jesus said to them again, \"Peace be with you. As the Father has sent me, so I send you.\" And when he had said this, he breathed on them and said to them, \"Receive the Holy Spirit. Whose sins you forgive are forgiven them, and whose sins you retain are retained.\"" },
    },
  },
  "2026-05-31": {
    weekday: "Sunday", liturgicalDate: "Most Holy Trinity",
    season: "Ordinary Time", rank: "Solemnity",
    feast: { name: "The Most Holy Trinity", years: "Eternally", feastDay: "First Sunday after Pentecost",
      line: "One God in three Persons — Father, Son, and Holy Spirit. The mystery at the heart of all reality.",
      verse: "Go, therefore, and make disciples of all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Spirit.", verseRef: "Matthew 28:19" },
    readings: {
      first:  { ref: "Proverbs 8:22–31",      blurb: "Wisdom was beside the Lord as his craftsman, his delight day by day." },
      psalm:  { ref: "Psalm 8",               blurb: "O Lord, our God, how wonderful your name in all the earth!" },
      gospel: { ref: "John 16:12–15",         blurb: "When the Spirit of truth comes, he will guide you to all truth.",
                text: "Jesus said: \"I have much more to tell you, but you cannot bear it now. But when he comes, the Spirit of truth, he will guide you to all truth.\"" },
    },
  },
  "2026-06-07": {
    weekday: "Sunday", liturgicalDate: "The Most Holy Body and Blood of Christ — Corpus Christi",
    season: "Ordinary Time", rank: "Solemnity",
    feast: { name: "Corpus Christi", years: "Instituted 1264", feastDay: "Sunday after Trinity",
      line: "The Eucharist — the Body and Blood of Christ, source and summit of the Christian life.",
      verse: "This is my body, which will be given for you.", verseRef: "Luke 22:19" },
    readings: {
      first:  { ref: "Genesis 14:18–20",      blurb: "Melchizedek, king of Salem, brought out bread and wine." },
      psalm:  { ref: "Psalm 110",             blurb: "You are a priest forever, in the line of Melchizedek." },
      gospel: { ref: "Luke 9:11b–17",         blurb: "They all ate and were satisfied.",
                text: "Then taking the five loaves and the two fish, and looking up to heaven, he said the blessing over them, broke them, and gave them to the disciples to set before the crowd. They all ate and were satisfied." },
    },
  },
  "2026-06-13": {
    weekday: "Saturday", liturgicalDate: "Memorial of St. Anthony of Padua, Doctor of the Church",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. Anthony of Padua", years: "1195–1231", feastDay: "June 13",
      line: "Franciscan, preacher, Doctor of the Church. Patron of the lost.",
      verse: "Actions speak louder than words; let your words teach and your actions speak.", verseRef: "St. Anthony of Padua" },
    readings: {
      first:  { ref: "Isaiah 61:1–3",         blurb: "The Spirit of the Lord God is upon me." },
      psalm:  { ref: "Psalm 89",              blurb: "Forever I will sing the goodness of the Lord." },
      gospel: { ref: "Matthew 5:13–19",       blurb: "You are the salt of the earth. You are the light of the world.",
                text: "Jesus said: \"You are the light of the world. A city set on a mountain cannot be hidden. Just so, your light must shine before others, that they may see your good deeds and glorify your heavenly Father.\"" },
    },
  },
  "2026-06-19": {
    weekday: "Friday", liturgicalDate: "Most Sacred Heart of Jesus",
    season: "Ordinary Time", rank: "Solemnity",
    feast: { name: "The Most Sacred Heart of Jesus", years: "Devotion since the Middle Ages",
      feastDay: "Friday after Corpus Christi",
      line: "The pierced Heart of Christ — the love that gives itself entirely.",
      verse: "Behold this Heart which has so loved men.", verseRef: "Christ to St. Margaret Mary Alacoque" },
    readings: {
      first:  { ref: "Ezekiel 34:11–16",      blurb: "I myself will pasture my sheep; I myself will give them rest." },
      psalm:  { ref: "Psalm 23",              blurb: "The Lord is my shepherd; there is nothing I shall want." },
      gospel: { ref: "Luke 15:3–7",           blurb: "Rejoice with me, for I have found my lost sheep.",
                text: "Jesus addressed this parable to them: \"What man among you having a hundred sheep and losing one of them would not leave the ninety-nine in the desert and go after the lost one until he finds it?\"" },
    },
  },
  "2026-06-24": {
    weekday: "Wednesday", liturgicalDate: "Solemnity of the Nativity of St. John the Baptist",
    season: "Ordinary Time", rank: "Solemnity",
    feast: { name: "Nativity of St. John the Baptist", years: "1st century BC", feastDay: "June 24",
      line: "The forerunner. The voice crying in the wilderness. The greatest born of woman.",
      verse: "He must increase; I must decrease.", verseRef: "John 3:30" },
    readings: {
      first:  { ref: "Isaiah 49:1–6",         blurb: "Before birth the Lord called me; from my mother's womb he gave me my name." },
      psalm:  { ref: "Psalm 139",             blurb: "I praise you, for I am wonderfully made." },
      gospel: { ref: "Luke 1:57–66, 80",      blurb: "He shall be called John.",
                text: "When her neighbors and relatives heard that the Lord had shown his great mercy toward her, they rejoiced with her. They asked his father by signs what he wished him to be called. He asked for a tablet and wrote, \"John is his name,\" and all were amazed." },
    },
  },
  "2026-06-29": {
    weekday: "Monday", liturgicalDate: "Solemnity of Sts. Peter and Paul, Apostles",
    season: "Ordinary Time", rank: "Solemnity",
    feast: { name: "Sts. Peter and Paul", years: "1st century", feastDay: "June 29",
      line: "The two pillars of the Church — the rock and the apostle to the nations. Both martyred in Rome.",
      verse: "I have fought the good fight, I have finished the race, I have kept the faith.", verseRef: "2 Timothy 4:7" },
    readings: {
      first:  { ref: "Acts 12:1–11",          blurb: "Now I know for certain that the Lord sent his angel and rescued me from the hand of Herod." },
      psalm:  { ref: "Psalm 34",              blurb: "The angel of the Lord will rescue those who fear him." },
      gospel: { ref: "Matthew 16:13–19",      blurb: "You are Peter, and upon this rock I will build my Church.",
                text: "Jesus said to him in reply, \"Blessed are you, Simon son of Jonah. For flesh and blood has not revealed this to you, but my heavenly Father. And so I say to you, you are Peter, and upon this rock I will build my Church, and the gates of the netherworld shall not prevail against it.\"" },
    },
  },
  "2026-07-03": {
    weekday: "Friday", liturgicalDate: "Feast of St. Thomas, Apostle",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "St. Thomas, Apostle", years: "1st century", feastDay: "July 3",
      line: "The doubter who proclaimed: 'My Lord and my God.' Tradition: he carried the Gospel to India.",
      verse: "My Lord and my God!", verseRef: "John 20:28" },
    readings: {
      first:  { ref: "Ephesians 2:19–22",     blurb: "You are fellow citizens with the holy ones, members of the household of God." },
      psalm:  { ref: "Psalm 117",             blurb: "Go out to all the world and tell the Good News." },
      gospel: { ref: "John 20:24–29",         blurb: "Have you come to believe because you have seen me?",
                text: "Thomas answered and said to him, \"My Lord and my God!\" Jesus said to him, \"Have you come to believe because you have seen me? Blessed are those who have not seen and have yet believed.\"" },
    },
  },
  "2026-07-11": {
    weekday: "Saturday", liturgicalDate: "Memorial of St. Benedict, Patriarch of Western Monasticism",
    season: "Ordinary Time", rank: "Memorial",
    feast: {
      name: "St. Benedict of Nursia", years: "480–547", feastDay: "July 11",
      line: "Patriarch of the West. Author of the Rule. Patron of Europe. Founder of Western monasticism. Patron of the House of Earth.",
      verse: "Ora et labora — pray and work.",
      verseRef: "Tradition · St. Benedict",
    },
    readings: {
      first:  { ref: "Proverbs 2:1–9",        blurb: "If you call out for understanding, you will find the knowledge of God." },
      psalm:  { ref: "Psalm 34",              blurb: "I will bless the Lord at all times." },
      gospel: { ref: "Matthew 19:27–29",      blurb: "Everyone who has given up houses or family for my sake will receive a hundred times more.",
                text: "Peter said to Jesus in reply, \"We have given up everything and followed you. What will there be for us?\" Jesus said to them, \"Amen, I say to you that you who have followed me, in the new age, when the Son of Man is seated on his throne of glory, will yourselves sit on twelve thrones, judging the twelve tribes of Israel.\"" },
    },
  },
  "2026-07-16": {
    weekday: "Thursday", liturgicalDate: "Memorial of Our Lady of Mount Carmel",
    season: "Ordinary Time", rank: "Memorial",
    feast: {
      name: "Our Lady of Mount Carmel", years: "Devotion since the 13th century",
      feastDay: "July 16",
      line: "Patroness of the Carmelite Order. The Brown Scapular. Mother of all who climb toward contemplation.",
      verse: "Flower of Carmel, Vine blossom-laden, Splendor of heaven.",
      verseRef: "Carmelite hymn",
    },
    readings: {
      first:  { ref: "Zechariah 2:14–17",     blurb: "Sing and rejoice, O daughter Zion! See, I am coming to dwell among you." },
      psalm:  { ref: "Luke 1:46–55",          blurb: "My soul magnifies the Lord." },
      gospel: { ref: "Matthew 12:46–50",      blurb: "Whoever does the will of my heavenly Father is my brother, sister, and mother.",
                text: "While he was still speaking to the crowds, his mother and his brothers appeared outside, wishing to speak with him. Stretching out his hand toward his disciples, he said, \"Here are my mother and my brothers. For whoever does the will of my heavenly Father is my brother, and sister, and mother.\"" },
    },
  },
  "2026-07-22": {
    weekday: "Wednesday", liturgicalDate: "Feast of St. Mary Magdalene",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "St. Mary Magdalene", years: "1st century", feastDay: "July 22",
      line: "Apostle to the Apostles. The first witness of the Resurrection. The friend of Christ at the tomb.",
      verse: "Mary!", verseRef: "John 20:16" },
    readings: {
      first:  { ref: "Song of Songs 3:1–4b",  blurb: "I sought him whom my heart loves." },
      psalm:  { ref: "Psalm 63",              blurb: "My soul is thirsting for you, O Lord my God." },
      gospel: { ref: "John 20:1–2, 11–18",    blurb: "Go to my brothers and tell them.",
                text: "Jesus said to her, \"Mary!\" She turned and said to him in Hebrew, \"Rabbouni,\" which means Teacher. Jesus said to her, \"Stop holding on to me, for I have not yet ascended to the Father. But go to my brothers and tell them, 'I am going to my Father and your Father, to my God and your God.'\"" },
    },
  },
  "2026-07-25": {
    weekday: "Saturday", liturgicalDate: "Feast of St. James, Apostle",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "St. James the Greater, Apostle", years: "1st century", feastDay: "July 25",
      line: "Brother of John, son of Zebedee. The first apostle to be martyred. Patron of pilgrims and Spain.",
      verse: "Can you drink the chalice that I am going to drink?", verseRef: "Matthew 20:22" },
    readings: {
      first:  { ref: "2 Corinthians 4:7–15",  blurb: "We are afflicted in every way but not constrained." },
      psalm:  { ref: "Psalm 126",             blurb: "Those who sow in tears shall reap rejoicing." },
      gospel: { ref: "Matthew 20:20–28",      blurb: "Whoever wishes to be great among you shall be your servant.",
                text: "Jesus said in reply, \"You do not know what you are asking. Can you drink the chalice that I am going to drink?\" They said to him, \"We can.\" He replied, \"My chalice you will indeed drink.\"" },
    },
  },
  "2026-07-26": {
    weekday: "Sunday", liturgicalDate: "Memorial of Sts. Joachim and Anne, Parents of the Blessed Virgin Mary",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "Sts. Joachim and Anne", years: "1st century BC", feastDay: "July 26",
      line: "The parents of the Virgin Mary. The grandparents of Jesus. The hidden saints of the family that bore the Christ.",
      verse: "Blessed is she who believed.", verseRef: "Luke 1:45 (of their daughter)" },
    readings: {
      first:  { ref: "Sirach 44:1, 10–15",    blurb: "Their offspring will continue forever, and their glory will not be blotted out." },
      psalm:  { ref: "Psalm 132",             blurb: "The Lord God will give him the throne of David, his father." },
      gospel: { ref: "Matthew 13:16–17",      blurb: "Blessed are your eyes, because they see, and your ears, because they hear.",
                text: "Jesus said to his disciples: \"Blessed are your eyes, because they see, and your ears, because they hear. Amen, I say to you, many prophets and righteous people longed to see what you see but did not see it, and to hear what you hear but did not hear it.\"" },
    },
  },
  "2026-07-31": {
    weekday: "Friday", liturgicalDate: "Memorial of St. Ignatius of Loyola, Founder of the Jesuits",
    season: "Ordinary Time", rank: "Memorial",
    feast: {
      name: "St. Ignatius of Loyola", years: "1491–1556", feastDay: "July 31",
      line: "Founder of the Society of Jesus. Author of the Spiritual Exercises. The soldier-saint who became the Church's great formator of missionaries.",
      verse: "Go and set the world on fire. Ad maiorem Dei gloriam.",
      verseRef: "St. Ignatius of Loyola",
    },
    readings: {
      first:  { ref: "1 Corinthians 10:31–11:1", blurb: "Whether you eat or drink, do everything for the glory of God." },
      psalm:  { ref: "Psalm 34",              blurb: "Taste and see the goodness of the Lord." },
      gospel: { ref: "Luke 14:25–33",         blurb: "Anyone who does not renounce all his possessions cannot be my disciple.",
                text: "Jesus said to the great crowds traveling with him: \"If anyone comes to me without hating his father and mother, wife and children, brothers and sisters, and even his own life, he cannot be my disciple. Whoever does not carry his own cross and come after me cannot be my disciple.\"" },
    },
  },

  /* ===== AUGUST 2026 ===== */
  "2026-08-04": {
    weekday: "Tuesday", liturgicalDate: "Memorial of St. John Vianney",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. John Vianney, the Curé d'Ars", years: "1786–1859", feastDay: "August 4",
      line: "Patron of parish priests. The simple country priest of Ars who heard sixteen hours of confessions a day.",
      verse: "The priesthood is the love of the Heart of Jesus.", verseRef: "St. John Vianney" },
    readings: {
      first:  { ref: "Jeremiah 30:1–2, 12–15, 18–22", blurb: "Behold, I will restore the tents of Jacob." },
      psalm:  { ref: "Psalm 102",             blurb: "The Lord will rebuild Zion in glory." },
      gospel: { ref: "Matthew 14:22–36",      blurb: "It is I; do not be afraid.",
                text: "Jesus made the disciples get into a boat and precede him to the other side of the sea. After he had dismissed the crowds, he went up on the mountain by himself to pray." },
    },
  },
  "2026-08-06": {
    weekday: "Thursday", liturgicalDate: "Feast of the Transfiguration of the Lord",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "The Transfiguration of the Lord", years: "33 AD", feastDay: "August 6",
      line: "On Tabor, Christ is transfigured before Peter, James, and John. The veil drawn back. A glimpse of glory.",
      verse: "This is my beloved Son, with whom I am well pleased; listen to him.", verseRef: "Matthew 17:5" },
    readings: {
      first:  { ref: "Daniel 7:9–10, 13–14",  blurb: "His clothing was bright as snow." },
      psalm:  { ref: "Psalm 97",              blurb: "The Lord is king, the Most High over all the earth." },
      gospel: { ref: "Luke 9:28b–36",         blurb: "While he was praying his face changed in appearance.",
                text: "While Jesus was praying his face changed in appearance and his clothing became dazzling white. And behold, two men were conversing with him, Moses and Elijah, who appeared in glory and spoke of his exodus that he was going to accomplish in Jerusalem." },
    },
  },
  "2026-08-08": {
    weekday: "Saturday", liturgicalDate: "Memorial of St. Dominic, Founder of the Order of Preachers",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. Dominic de Guzmán", years: "1170–1221", feastDay: "August 8",
      line: "Founder of the Order of Preachers (Dominicans). Patron of the House of Light.",
      verse: "Speak only to God or of God.", verseRef: "Tradition · St. Dominic" },
    readings: {
      first:  { ref: "Habakkuk 1:12–2:4",     blurb: "The just one, because of his faith, shall live." },
      psalm:  { ref: "Psalm 9",               blurb: "You forsake not those who seek you, O Lord." },
      gospel: { ref: "Matthew 17:14–20",      blurb: "If you have faith the size of a mustard seed, nothing will be impossible for you.",
                text: "Jesus said: \"If you have faith the size of a mustard seed, you will say to this mountain, 'Move from here to there,' and it will move. Nothing will be impossible for you.\"" },
    },
  },
  "2026-08-09": {
    weekday: "Sunday", liturgicalDate: "Nineteenth Sunday in Ordinary Time",
    season: "Ordinary Time", rank: "Sunday",
    readings: {
      first:  { ref: "Wisdom 18:6–9",         blurb: "The night of the passover was known beforehand to our ancestors." },
      psalm:  { ref: "Psalm 33",              blurb: "Blessed the people the Lord has chosen to be his own." },
      gospel: { ref: "Luke 12:32–48",         blurb: "Where your treasure is, there also will your heart be.",
                text: "Jesus said: \"Do not be afraid any longer, little flock, for your Father is pleased to give you the kingdom. Sell your belongings and give alms. For where your treasure is, there also will your heart be.\"" },
    },
  },
  "2026-08-10": {
    weekday: "Monday", liturgicalDate: "Feast of St. Lawrence, Deacon and Martyr",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "St. Lawrence of Rome", years: "225–258", feastDay: "August 10",
      line: "Deacon of Rome. Roasted alive on a gridiron. Patron of the poor — to whom he had given the Church's treasure before his martyrdom.",
      verse: "I am roasted on this side; turn me over, and eat.", verseRef: "St. Lawrence at his martyrdom" },
    readings: {
      first:  { ref: "2 Corinthians 9:6–10",  blurb: "God loves a cheerful giver." },
      psalm:  { ref: "Psalm 112",             blurb: "Blessed the man who is gracious and lends to those in need." },
      gospel: { ref: "John 12:24–26",         blurb: "Unless a grain of wheat falls to the ground and dies, it remains just a grain of wheat.",
                text: "Jesus said to his disciples: \"Amen, amen, I say to you, unless a grain of wheat falls to the ground and dies, it remains just a grain of wheat; but if it dies, it produces much fruit. Whoever loves his life loses it, and whoever hates his life in this world will preserve it for eternal life.\"" },
    },
  },
  "2026-08-11": {
    weekday: "Tuesday", liturgicalDate: "Memorial of St. Clare of Assisi",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. Clare of Assisi", years: "1194–1253", feastDay: "August 11",
      line: "Foundress of the Poor Clares. The first woman to write a monastic rule. Companion of Francis in the Lady Poverty.",
      verse: "Place your mind before the mirror of eternity. Place your soul in the brilliance of his glory.", verseRef: "St. Clare of Assisi" },
    readings: {
      first:  { ref: "Ezekiel 2:8–3:4",       blurb: "I gave it to him to eat, and it was as sweet as honey in my mouth." },
      psalm:  { ref: "Psalm 119",             blurb: "How sweet to my taste is your promise!" },
      gospel: { ref: "Matthew 18:1–5, 10, 12–14", blurb: "Whoever humbles himself like this child is the greatest in the kingdom of heaven.",
                text: "Jesus said: \"Amen, I say to you, unless you turn and become like children, you will not enter the kingdom of heaven. Whoever humbles himself like this child is the greatest in the kingdom of heaven.\"" },
    },
  },
  "2026-08-14": {
    weekday: "Friday", liturgicalDate: "Memorial of St. Maximilian Kolbe, Priest and Martyr",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. Maximilian Kolbe", years: "1894–1941", feastDay: "August 14",
      line: "Franciscan priest. Auschwitz, cell block 11. Volunteered to die in place of a stranger with a family. Martyr of charity.",
      verse: "I am a Catholic priest.", verseRef: "St. Maximilian Kolbe, to his executioners" },
    readings: {
      first:  { ref: "Joshua 24:1–13",        blurb: "I gave you a land you had not tilled and cities you had not built." },
      psalm:  { ref: "Psalm 136",             blurb: "His mercy endures forever." },
      gospel: { ref: "Matthew 19:3–12",       blurb: "What God has joined together, no human being must separate.",
                text: "Some Pharisees approached Jesus, and tested him, saying, \"Is it lawful for a man to divorce his wife for any cause whatever?\" He said in reply, \"Have you not read that from the beginning the Creator made them male and female?\"" },
    },
  },
  "2026-08-15": {
    weekday: "Saturday", liturgicalDate: "The Assumption of the Blessed Virgin Mary",
    season: "Ordinary Time", rank: "Solemnity",
    feast: { name: "The Assumption of the Blessed Virgin Mary", years: "Defined as dogma 1950", feastDay: "August 15",
      line: "Mary, body and soul, was assumed into heavenly glory. Promise and pledge of the resurrection of all the faithful.",
      verse: "My soul magnifies the Lord, and my spirit rejoices in God my Savior.", verseRef: "Luke 1:46–47" },
    readings: {
      first:  { ref: "Revelation 11:19a; 12:1–6a, 10ab", blurb: "A great sign appeared in the sky, a woman clothed with the sun." },
      psalm:  { ref: "Psalm 45",              blurb: "The queen stands at your right hand, arrayed in gold." },
      gospel: { ref: "Luke 1:39–56",          blurb: "The Mighty One has done great things for me.",
                text: "Mary said: \"My soul proclaims the greatness of the Lord; my spirit rejoices in God my Savior, for he has looked with favor on his lowly servant. From this day all generations will call me blessed: the Almighty has done great things for me, and holy is his Name.\"" },
    },
  },
  "2026-08-16": {
    weekday: "Sunday", liturgicalDate: "Twentieth Sunday in Ordinary Time",
    season: "Ordinary Time", rank: "Sunday",
    readings: {
      first:  { ref: "Jeremiah 38:4–6, 8–10", blurb: "You have borne me, a man of strife." },
      psalm:  { ref: "Psalm 40",              blurb: "Lord, come to my aid!" },
      gospel: { ref: "Luke 12:49–53",         blurb: "I have come to set the earth on fire.",
                text: "Jesus said to his disciples: \"I have come to set the earth on fire, and how I wish it were already blazing!\"" },
    },
  },
  "2026-08-22": {
    weekday: "Saturday", liturgicalDate: "Memorial of the Queenship of the Blessed Virgin Mary",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "The Queenship of Mary", years: "Established by Pius XII, 1954", feastDay: "August 22",
      line: "Mary, Queen of Heaven and Earth — the octave of the Assumption. The crown that follows the cross.",
      verse: "Hail, holy Queen, Mother of mercy.", verseRef: "Salve Regina" },
    readings: {
      first:  { ref: "Isaiah 9:1–6",          blurb: "A child is born for us, a son given to us." },
      psalm:  { ref: "Psalm 113",             blurb: "Blessed be the name of the Lord forever." },
      gospel: { ref: "Luke 1:26–38",          blurb: "Behold, you will conceive in your womb and bear a son.",
                text: "The angel said to Mary, \"Do not be afraid, Mary, for you have found favor with God. Behold, you will conceive in your womb and bear a son, and you shall name him Jesus. He will be great and will be called Son of the Most High.\"" },
    },
  },
  "2026-08-23": {
    weekday: "Sunday", liturgicalDate: "Twenty-First Sunday in Ordinary Time",
    season: "Ordinary Time", rank: "Sunday",
    readings: {
      first:  { ref: "Isaiah 66:18–21",       blurb: "I come to gather nations of every language." },
      psalm:  { ref: "Psalm 117",             blurb: "Go out to all the world and tell the Good News." },
      gospel: { ref: "Luke 13:22–30",         blurb: "Strive to enter through the narrow gate.",
                text: "Jesus said: \"Strive to enter through the narrow gate, for many, I tell you, will attempt to enter but will not be strong enough.\"" },
    },
  },
  "2026-08-27": {
    weekday: "Thursday", liturgicalDate: "Memorial of St. Monica",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. Monica", years: "332–387", feastDay: "August 27",
      line: "Mother of St. Augustine. Wept and prayed for her son for thirty years before his conversion. Patron of mothers.",
      verse: "The son of so many tears could not be lost.", verseRef: "St. Ambrose, to St. Monica" },
    readings: {
      first:  { ref: "1 Thessalonians 3:7–13", blurb: "May the Lord cause you to abound in love for one another." },
      psalm:  { ref: "Psalm 90",              blurb: "Fill us with your love, O Lord, and we will sing for joy!" },
      gospel: { ref: "Matthew 24:42–51",      blurb: "Stay awake! For you do not know on which day your Lord will come.",
                text: "Jesus said: \"Stay awake! For you do not know on which day your Lord will come. Be sure of this: if the master of the house had known the hour of night when the thief was coming, he would have stayed awake and not let his house be broken into.\"" },
    },
  },
  "2026-08-28": {
    weekday: "Friday", liturgicalDate: "Memorial of St. Augustine, Bishop and Doctor of the Church",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. Augustine of Hippo", years: "354–430", feastDay: "August 28",
      line: "Doctor of Grace. Bishop of Hippo. Author of the Confessions and the City of God. The Western Church's deepest theologian.",
      verse: "You have made us for yourself, O Lord, and our heart is restless until it rests in you.", verseRef: "Confessions, I.1" },
    readings: {
      first:  { ref: "1 Thessalonians 4:1–8", blurb: "It is the will of God that you grow in holiness." },
      psalm:  { ref: "Psalm 97",              blurb: "Rejoice in the Lord, you just!" },
      gospel: { ref: "Matthew 25:1–13",       blurb: "Behold, the bridegroom! Come out to meet him!",
                text: "Jesus told the parable of the ten virgins. Five were wise and brought oil with their lamps; five were foolish and did not. When the bridegroom was delayed, they all became drowsy and fell asleep." },
    },
  },

  /* ===== SEPTEMBER 2026 ===== */
  "2026-09-08": {
    weekday: "Tuesday", liturgicalDate: "Feast of the Nativity of the Blessed Virgin Mary",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "The Nativity of Mary", years: "Tradition since the 6th century", feastDay: "September 8",
      line: "The birth of the Mother of God. The dawn of salvation.",
      verse: "The root of Jesse has blossomed.", verseRef: "Liturgy of the Hours, Sept 8" },
    readings: {
      first:  { ref: "Micah 5:1–4a",          blurb: "From you shall come forth one who is to be ruler in Israel." },
      psalm:  { ref: "Psalm 13",              blurb: "With delight I rejoice in the Lord." },
      gospel: { ref: "Matthew 1:1–16, 18–23", blurb: "She will bear a son and you shall call him Jesus.",
                text: "When his mother Mary was betrothed to Joseph, but before they lived together, she was found with child through the Holy Spirit." },
    },
  },
  "2026-09-13": {
    weekday: "Sunday", liturgicalDate: "Twenty-Fourth Sunday in Ordinary Time",
    season: "Ordinary Time", rank: "Sunday",
    feast: { name: "St. John Chrysostom, Doctor of the Church", years: "347–407", feastDay: "September 13",
      line: "Patriarch of Constantinople. Golden-mouthed preacher. Doctor of the Church.",
      verse: "Glory to God for all things.", verseRef: "St. John Chrysostom (his last words)" },
    readings: {
      first:  { ref: "Exodus 32:7–11, 13–14", blurb: "The Lord relented in the punishment he had threatened." },
      psalm:  { ref: "Psalm 51",              blurb: "I will rise and go to my father." },
      gospel: { ref: "Luke 15:1–32",          blurb: "Rejoice with me, for I have found my lost sheep.",
                text: "Jesus told them this parable: \"What man among you having a hundred sheep and losing one of them would not leave the ninety-nine in the desert and go after the lost one until he finds it?\"" },
    },
  },
  "2026-09-14": {
    weekday: "Monday", liturgicalDate: "Feast of the Exaltation of the Holy Cross",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "The Exaltation of the Holy Cross", years: "Discovered by St. Helena, c. 326",
      feastDay: "September 14",
      line: "The True Cross — instrument of our salvation, throne of the King.",
      verse: "We adore you, O Christ, and we bless you. Because by your holy cross you have redeemed the world.", verseRef: "Liturgy of Good Friday" },
    readings: {
      first:  { ref: "Numbers 21:4b–9",       blurb: "Whoever looked at the bronze serpent recovered." },
      psalm:  { ref: "Psalm 78",              blurb: "Do not forget the works of the Lord!" },
      gospel: { ref: "John 3:13–17",          blurb: "God so loved the world that he gave his only Son.",
                text: "Jesus said: \"For God so loved the world that he gave his only Son, so that everyone who believes in him might not perish but might have eternal life.\"" },
    },
  },
  "2026-09-15": {
    weekday: "Tuesday", liturgicalDate: "Memorial of Our Lady of Sorrows",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "Our Lady of Sorrows", years: "Devotion since the 13th century", feastDay: "September 15",
      line: "The seven sorrows of Mary. The Mother who stood at the foot of the cross.",
      verse: "Behold your mother.", verseRef: "John 19:27" },
    readings: {
      first:  { ref: "Hebrews 5:7–9",         blurb: "He learned obedience from what he suffered." },
      psalm:  { ref: "Psalm 31",              blurb: "Save me, O Lord, in your kindness." },
      gospel: { ref: "John 19:25–27",         blurb: "Behold your son. Behold your mother.",
                text: "Standing by the cross of Jesus were his mother and his mother's sister, Mary the wife of Clopas, and Mary of Magdala. When Jesus saw his mother and the disciple there whom he loved, he said to his mother, \"Woman, behold, your son.\" Then he said to the disciple, \"Behold, your mother.\"" },
    },
  },
  "2026-09-21": {
    weekday: "Monday", liturgicalDate: "Feast of St. Matthew, Apostle and Evangelist",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "St. Matthew", years: "1st century", feastDay: "September 21",
      line: "Tax collector turned apostle. Evangelist of the first Gospel. Patron of bankers.",
      verse: "Follow me.", verseRef: "Matthew 9:9" },
    readings: {
      first:  { ref: "Ephesians 4:1–7, 11–13", blurb: "I urge you to live in a manner worthy of the call you have received." },
      psalm:  { ref: "Psalm 19",              blurb: "Their message goes out through all the earth." },
      gospel: { ref: "Matthew 9:9–13",        blurb: "I did not come to call the righteous but sinners.",
                text: "As Jesus passed by, he saw a man named Matthew sitting at the customs post. He said to him, \"Follow me.\" And he got up and followed him." },
    },
  },
  "2026-09-23": {
    weekday: "Wednesday", liturgicalDate: "Memorial of St. Padre Pio of Pietrelcina",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. Padre Pio", years: "1887–1968", feastDay: "September 23",
      line: "Capuchin friar. Bore the stigmata for fifty years. Confessor of saints. Visionary.",
      verse: "Pray, hope, and don't worry.", verseRef: "St. Padre Pio" },
    readings: {
      first:  { ref: "Ezra 9:5–9",            blurb: "Our God has not forsaken us." },
      psalm:  { ref: "Tobit 13",              blurb: "Blessed be God, who lives forever." },
      gospel: { ref: "Luke 9:1–6",            blurb: "Take nothing for the journey.",
                text: "Jesus summoned the Twelve and gave them power and authority over all demons and to cure diseases, and he sent them to proclaim the kingdom of God and to heal the sick." },
    },
  },
  "2026-09-29": {
    weekday: "Tuesday", liturgicalDate: "Feast of Sts. Michael, Gabriel, and Raphael, Archangels",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "Sts. Michael, Gabriel, and Raphael", years: "—", feastDay: "September 29",
      line: "The three archangels. Michael the protector. Gabriel the messenger. Raphael the healer.",
      verse: "Who is like God? — Mi-ka-El.", verseRef: "St. Michael's name" },
    readings: {
      first:  { ref: "Daniel 7:9–10, 13–14",  blurb: "Thousands upon thousands were ministering to him." },
      psalm:  { ref: "Psalm 138",             blurb: "In the sight of the angels I will sing your praises." },
      gospel: { ref: "John 1:47–51",          blurb: "You will see the angels of God ascending and descending on the Son of Man.",
                text: "Jesus said: \"Amen, amen, I say to you, you will see heaven opened and the angels of God ascending and descending on the Son of Man.\"" },
    },
  },
  "2026-09-30": {
    weekday: "Wednesday", liturgicalDate: "Memorial of St. Jerome, Priest and Doctor of the Church",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. Jerome", years: "347–420", feastDay: "September 30",
      line: "Translator of the Vulgate Bible. Hermit of Bethlehem. Patron of librarians and scripture scholars.",
      verse: "Ignorance of Scripture is ignorance of Christ.", verseRef: "St. Jerome" },
    readings: {
      first:  { ref: "Nehemiah 2:1–8",        blurb: "Send me to Judah to rebuild it." },
      psalm:  { ref: "Psalm 137",             blurb: "Let my tongue be silenced if I ever forget you!" },
      gospel: { ref: "Luke 9:57–62",          blurb: "No one who sets a hand to the plow and looks to what was left behind is fit for the kingdom of God.",
                text: "Jesus said to him, \"Foxes have dens and birds of the sky have nests, but the Son of Man has nowhere to rest his head.\"" },
    },
  },

  /* ===== OCTOBER 2026 ===== */
  "2026-10-01": {
    weekday: "Thursday", liturgicalDate: "Memorial of St. Thérèse of the Child Jesus, the Little Flower",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. Thérèse of Lisieux", years: "1873–1897", feastDay: "October 1",
      line: "Doctor of the Church at twenty-four years old. The Little Way. Carmelite of the House of Fire.",
      verse: "I will spend my heaven doing good on earth.", verseRef: "St. Thérèse of Lisieux" },
    readings: {
      first:  { ref: "Isaiah 66:10–14c",      blurb: "As a mother comforts her son, so will I comfort you." },
      psalm:  { ref: "Psalm 131",             blurb: "In you, Lord, I have found my peace." },
      gospel: { ref: "Matthew 18:1–4",        blurb: "Whoever humbles himself like this child is the greatest in the kingdom of heaven.",
                text: "Jesus said: \"Amen, I say to you, unless you turn and become like children, you will not enter the kingdom of heaven. Whoever humbles himself like this child is the greatest in the kingdom of heaven.\"" },
    },
  },
  "2026-10-02": {
    weekday: "Friday", liturgicalDate: "Memorial of the Holy Guardian Angels",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "The Holy Guardian Angels", years: "—", feastDay: "October 2",
      line: "Each soul has a guardian angel — sent from God to enlighten, protect, and lead us to heaven.",
      verse: "He has commanded his angels concerning you, to guard you in all your ways.", verseRef: "Psalm 91:11" },
    readings: {
      first:  { ref: "Exodus 23:20–23",       blurb: "I am sending an angel before you, to guard you on the way." },
      psalm:  { ref: "Psalm 91",              blurb: "He has put his angels in charge of you, to guard you in all your ways." },
      gospel: { ref: "Matthew 18:1–5, 10",    blurb: "Their angels in heaven always look upon the face of my heavenly Father.",
                text: "Jesus said: \"See that you do not despise one of these little ones, for I say to you that their angels in heaven always look upon the face of my heavenly Father.\"" },
    },
  },
  "2026-10-04": {
    weekday: "Sunday", liturgicalDate: "Memorial of St. Francis of Assisi · 27th Sunday in Ordinary Time",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. Francis of Assisi", years: "1181–1226", feastDay: "October 4",
      line: "Founder of the Franciscans. Patron of the House of Joy. He gave the Eucharist to the whole Church.",
      verse: "Where there is hatred, let me sow love.", verseRef: "Prayer of St. Francis" },
    readings: {
      first:  { ref: "Habakkuk 1:2–3; 2:2–4", blurb: "The vision still has its time, presses on to fulfillment." },
      psalm:  { ref: "Psalm 95",              blurb: "If today you hear his voice, harden not your hearts." },
      gospel: { ref: "Luke 17:5–10",          blurb: "If you have faith the size of a mustard seed, you would say to this mulberry tree, 'Be uprooted.'",
                text: "The apostles said to the Lord, \"Increase our faith.\" The Lord replied, \"If you have faith the size of a mustard seed, you would say to this mulberry tree, 'Be uprooted and planted in the sea,' and it would obey you.\"" },
    },
  },
  "2026-10-07": {
    weekday: "Wednesday", liturgicalDate: "Memorial of Our Lady of the Rosary",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "Our Lady of the Rosary", years: "Established after Lepanto, 1571", feastDay: "October 7",
      line: "Commemorates the victory at the Battle of Lepanto attributed to the Rosary's intercession. The prayer that has saved the West more than once.",
      verse: "The Rosary is a long chain that links heaven and earth.", verseRef: "Sister Lucia of Fatima" },
    readings: {
      first:  { ref: "Acts 1:12–14",          blurb: "All these devoted themselves with one accord to prayer, together with Mary." },
      psalm:  { ref: "Luke 1:46–55",          blurb: "The Almighty has done great things for me, and holy is his name." },
      gospel: { ref: "Luke 1:26–38",          blurb: "Behold, you will conceive in your womb and bear a son.",
                text: "Mary said, \"Behold, I am the handmaid of the Lord. May it be done to me according to your word.\" Then the angel departed from her." },
    },
  },
  "2026-10-15": {
    weekday: "Thursday", liturgicalDate: "Memorial of St. Teresa of Jesus (of Ávila), Doctor of the Church",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "St. Teresa of Ávila", years: "1515–1582", feastDay: "October 15",
      line: "Doctor of the Church. Reformer of Carmel. Author of the Interior Castle. Patroness of the House of Fire.",
      verse: "Let nothing disturb you. Let nothing frighten you. All things pass. God does not change. Patience obtains all things. Whoever has God lacks nothing — God alone is enough.", verseRef: "St. Teresa of Ávila" },
    readings: {
      first:  { ref: "Romans 8:22–27",        blurb: "The Spirit himself intercedes with inexpressible groanings." },
      psalm:  { ref: "Psalm 19",              blurb: "The precepts of the Lord give joy to the heart." },
      gospel: { ref: "John 15:1–8",           blurb: "Whoever remains in me and I in him will bear much fruit.",
                text: "Jesus said: \"I am the vine, you are the branches. Whoever remains in me and I in him will bear much fruit, because without me you can do nothing.\"" },
    },
  },
  "2026-10-18": {
    weekday: "Sunday", liturgicalDate: "Feast of St. Luke, Evangelist · 29th Sunday in Ordinary Time",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "St. Luke", years: "1st century", feastDay: "October 18",
      line: "Evangelist of the third Gospel and the Acts of the Apostles. Companion of Paul. Tradition: a physician.",
      verse: "Beloved physician.", verseRef: "Colossians 4:14 (of Luke)" },
    readings: {
      first:  { ref: "2 Timothy 4:10–17b",    blurb: "Luke is the only one with me." },
      psalm:  { ref: "Psalm 145",             blurb: "Your friends make known, O Lord, the glorious splendor of your kingdom." },
      gospel: { ref: "Luke 10:1–9",           blurb: "The harvest is abundant, but the laborers are few.",
                text: "The Lord Jesus appointed seventy-two others, whom he sent ahead of him in pairs to every town and place he intended to visit. He said to them, \"The harvest is abundant but the laborers are few; so ask the master of the harvest to send out laborers for his harvest.\"" },
    },
  },
  "2026-10-22": {
    weekday: "Thursday", liturgicalDate: "Memorial of St. John Paul II, Pope",
    season: "Ordinary Time", rank: "Memorial",
    feast: { name: "Pope St. John Paul II", years: "1920–2005", feastDay: "October 22",
      line: "Karol Wojtyła. Pope from 1978 to 2005. Be not afraid. Author of Laborem exercens, Evangelium vitae, Theology of the Body. Saint of the family and of the worker.",
      verse: "Be not afraid! Open wide the doors for Christ.", verseRef: "Pope St. John Paul II, inaugural homily, October 22, 1978" },
    readings: {
      first:  { ref: "Romans 6:12–18",        blurb: "Present yourselves to God as raised from the dead to life." },
      psalm:  { ref: "Psalm 124",             blurb: "Our help is from the Lord, who made heaven and earth." },
      gospel: { ref: "Luke 12:39–48",         blurb: "Much will be required of the person entrusted with much.",
                text: "Jesus said: \"Be sure of this: if the master of the house had known the hour when the thief was coming, he would not have let his house be broken into. You also must be prepared, for at an hour you do not expect, the Son of Man will come.\"" },
    },
  },
  "2026-10-28": {
    weekday: "Wednesday", liturgicalDate: "Feast of Sts. Simon and Jude, Apostles",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "Sts. Simon and Jude", years: "1st century", feastDay: "October 28",
      line: "Two of the Twelve. Simon the Zealot. Jude (Thaddeus), patron of impossible causes.",
      verse: "Pray for us, St. Jude, helper of the hopeless.", verseRef: "Traditional invocation" },
    readings: {
      first:  { ref: "Ephesians 2:19–22",     blurb: "You are fellow citizens with the holy ones." },
      psalm:  { ref: "Psalm 19",              blurb: "Their message goes out through all the earth." },
      gospel: { ref: "Luke 6:12–16",          blurb: "Jesus called his disciples to himself, and from them he chose Twelve.",
                text: "Jesus departed to the mountain to pray, and he spent the night in prayer to God. When day came, he called his disciples to himself, and from them he chose Twelve, whom he also named Apostles." },
    },
  },

  /* ===== NOVEMBER 2026 ===== */
  "2026-11-01": {
    weekday: "Sunday", liturgicalDate: "Solemnity of All Saints",
    season: "Ordinary Time", rank: "Solemnity",
    feast: { name: "All Saints", years: "—", feastDay: "November 1",
      line: "The full company of saints in glory — known and unknown. The cloud of witnesses.",
      verse: "Blessed are the poor in spirit, for theirs is the kingdom of heaven.", verseRef: "Matthew 5:3" },
    readings: {
      first:  { ref: "Revelation 7:2–4, 9–14", blurb: "I saw a great multitude, which no one could count, from every nation, race, people, and tongue." },
      psalm:  { ref: "Psalm 24",              blurb: "Lord, this is the people that longs to see your face." },
      gospel: { ref: "Matthew 5:1–12a",       blurb: "Rejoice and be glad, for your reward will be great in heaven.",
                text: "Jesus said: \"Blessed are the poor in spirit, for theirs is the kingdom of heaven. Blessed are they who mourn, for they will be comforted. Blessed are the meek, for they will inherit the land. Blessed are they who hunger and thirst for righteousness, for they will be satisfied.\"" },
    },
  },
  "2026-11-02": {
    weekday: "Monday", liturgicalDate: "The Commemoration of All the Faithful Departed (All Souls)",
    season: "Ordinary Time", rank: "Solemnity",
    feast: { name: "All Souls", years: "Tradition since the 9th century", feastDay: "November 2",
      line: "The faithful departed who are being purified — the Church Suffering. Pray for them; they pray for us.",
      verse: "Eternal rest grant unto them, O Lord, and let perpetual light shine upon them.", verseRef: "Requiem aeternam" },
    readings: {
      first:  { ref: "Wisdom 3:1–9",          blurb: "The souls of the just are in the hand of God." },
      psalm:  { ref: "Psalm 23",              blurb: "The Lord is my shepherd; there is nothing I shall want." },
      gospel: { ref: "John 6:37–40",          blurb: "I shall not reject anyone who comes to me.",
                text: "Jesus said: \"Everyone who sees the Son and believes in him may have eternal life, and I shall raise him on the last day.\"" },
    },
  },
  "2026-11-09": {
    weekday: "Monday", liturgicalDate: "Feast of the Dedication of the Lateran Basilica",
    season: "Ordinary Time", rank: "Feast",
    feast: { name: "The Lateran Basilica", years: "Dedicated 324 AD", feastDay: "November 9",
      line: "St. John Lateran — Mother and Head of all the churches of the City and of the World. The Pope's cathedral.",
      verse: "I saw the holy city, a new Jerusalem, coming down out of heaven from God.", verseRef: "Revelation 21:2" },
    readings: {
      first:  { ref: "Ezekiel 47:1–2, 8–9, 12", blurb: "I saw water flowing from the temple." },
      psalm:  { ref: "Psalm 46",              blurb: "The waters of the river gladden the city of God." },
      gospel: { ref: "John 2:13–22",          blurb: "Destroy this temple and in three days I will raise it up.",
                text: "Jesus answered and said to them, \"Destroy this temple and in three days I will raise it up.\" The Jews said, \"This temple has been under construction for forty-six years, and you will raise it up in three days?\" But he was speaking about the temple of his Body." },
    },
  },
  "2026-11-22": {
    weekday: "Sunday", liturgicalDate: "Solemnity of Our Lord Jesus Christ, King of the Universe",
    season: "Ordinary Time", rank: "Solemnity",
    feast: { name: "Christ the King", years: "Established by Pius XI, 1925", feastDay: "Last Sunday of Ordinary Time",
      line: "The crowning Sunday of the liturgical year. Christ reigns — over hearts, over history, over the whole created order.",
      verse: "Jesus, remember me when you come into your kingdom.", verseRef: "Luke 23:42 (the Good Thief)" },
    readings: {
      first:  { ref: "2 Samuel 5:1–3",        blurb: "They anointed David king of Israel." },
      psalm:  { ref: "Psalm 122",             blurb: "Let us go rejoicing to the house of the Lord." },
      gospel: { ref: "Luke 23:35–43",         blurb: "Today you will be with me in Paradise.",
                text: "One of the criminals hanging there reviled Jesus, but the other rebuked him, saying, \"Have you no fear of God? Then he said, \"Jesus, remember me when you come into your kingdom.\" He replied, \"Amen, I say to you, today you will be with me in Paradise.\"" },
    },
  },
  "2026-11-29": {
    weekday: "Sunday", liturgicalDate: "First Sunday of Advent",
    season: "Advent", rank: "Sunday",
    feast: { name: "First Sunday of Advent · New liturgical year begins", years: "—", feastDay: "Four Sundays before Christmas",
      line: "Advent begins. The Church watches and waits for the coming of the Lord.",
      verse: "Stay awake! For you do not know on which day your Lord will come.", verseRef: "Matthew 24:42" },
    readings: {
      first:  { ref: "Jeremiah 33:14–16",     blurb: "I will raise up for David a just shoot." },
      psalm:  { ref: "Psalm 25",              blurb: "To you, O Lord, I lift my soul." },
      gospel: { ref: "Luke 21:25–28, 34–36",  blurb: "Stand erect and raise your heads because your redemption is at hand.",
                text: "Jesus said: \"Stand erect and raise your heads because your redemption is at hand. Be vigilant at all times and pray that you have the strength to escape the tribulations that are imminent and to stand before the Son of Man.\"" },
    },
  },
  "2026-11-30": {
    weekday: "Monday", liturgicalDate: "Feast of St. Andrew, Apostle",
    season: "Advent", rank: "Feast",
    feast: { name: "St. Andrew", years: "1st century", feastDay: "November 30",
      line: "Brother of Peter. The first-called. Patron of Scotland and Russia. Crucified on an X-shaped cross.",
      verse: "We have found the Messiah.", verseRef: "John 1:41" },
    readings: {
      first:  { ref: "Romans 10:9–18",        blurb: "Faith comes from what is heard." },
      psalm:  { ref: "Psalm 19",              blurb: "Their message goes out through all the earth." },
      gospel: { ref: "Matthew 4:18–22",       blurb: "I will make you fishers of men.",
                text: "As Jesus was walking by the Sea of Galilee, he saw two brothers, Simon, who is called Peter, and his brother Andrew, casting a net into the sea. He said to them, \"Come after me, and I will make you fishers of men.\" At once they left their nets and followed him." },
    },
  },

  /* ===== DECEMBER 2026 ===== */
  "2026-12-08": {
    weekday: "Tuesday", liturgicalDate: "Solemnity of the Immaculate Conception of the Blessed Virgin Mary",
    season: "Advent", rank: "Solemnity",
    feast: { name: "The Immaculate Conception", years: "Defined as dogma 1854", feastDay: "December 8",
      line: "Mary, from the first instant of her conception, was preserved free from all stain of original sin. The new Eve.",
      verse: "Hail, full of grace, the Lord is with you.", verseRef: "Luke 1:28" },
    readings: {
      first:  { ref: "Genesis 3:9–15, 20",    blurb: "I will put enmity between you and the woman." },
      psalm:  { ref: "Psalm 98",              blurb: "Sing to the Lord a new song, for he has done marvelous deeds." },
      gospel: { ref: "Luke 1:26–38",          blurb: "Hail, full of grace! The Lord is with you.",
                text: "The angel Gabriel was sent from God to a town of Galilee called Nazareth, to a virgin betrothed to a man named Joseph, of the house of David, and the virgin's name was Mary. The angel said to her, \"Hail, full of grace! The Lord is with you.\"" },
    },
  },
  "2026-12-12": {
    weekday: "Saturday", liturgicalDate: "Feast of Our Lady of Guadalupe",
    season: "Advent", rank: "Feast",
    feast: { name: "Our Lady of Guadalupe", years: "1531", feastDay: "December 12",
      line: "Mary appeared to St. Juan Diego on Tepeyac. The tilma. Patroness of the Americas. Protectress of the unborn.",
      verse: "Am I not here, I who am your mother?", verseRef: "Our Lady of Guadalupe to St. Juan Diego" },
    readings: {
      first:  { ref: "Zechariah 2:14–17",     blurb: "I am coming to dwell among you." },
      psalm:  { ref: "Judith 13",             blurb: "You are the highest honor of our race." },
      gospel: { ref: "Luke 1:39–47",          blurb: "Blessed are you who believed.",
                text: "When Elizabeth heard Mary's greeting, the infant leaped in her womb, and Elizabeth, filled with the Holy Spirit, cried out in a loud voice and said, \"Most blessed are you among women, and blessed is the fruit of your womb.\"" },
    },
  },
  "2026-12-13": {
    weekday: "Sunday", liturgicalDate: "Third Sunday of Advent · Gaudete Sunday",
    season: "Advent", rank: "Sunday",
    feast: { name: "St. Lucy of Syracuse", years: "283–304", feastDay: "December 13",
      line: "Virgin and martyr. Patroness of the blind. Her name means light — fitting for the Sunday of joyful waiting.",
      verse: "Rejoice in the Lord always; again I say, rejoice!", verseRef: "Philippians 4:4" },
    readings: {
      first:  { ref: "Zephaniah 3:14–18a",    blurb: "Shout for joy, O daughter Zion! Sing joyfully, O Israel!" },
      psalm:  { ref: "Isaiah 12",             blurb: "Cry out with joy and gladness: for among you is the great and Holy One of Israel." },
      gospel: { ref: "Luke 3:10–18",          blurb: "What should we do?",
                text: "The crowds asked John the Baptist, \"What should we do?\" He said to them in reply, \"Whoever has two cloaks should share with the person who has none. And whoever has food should do likewise.\"" },
    },
  },
  "2026-12-24": {
    weekday: "Thursday", liturgicalDate: "Christmas Eve · The Vigil of the Nativity",
    season: "Christmas", rank: "Solemnity (Vigil)",
    feast: { name: "Christmas Eve", years: "—", feastDay: "December 24",
      line: "The vigil of the Nativity of the Lord. The world holds its breath.",
      verse: "Tomorrow the wickedness of the earth will be destroyed. The Savior of the world will reign over us.", verseRef: "Liturgy of the Hours, Christmas Eve" },
    readings: {
      first:  { ref: "Isaiah 62:1–5",         blurb: "As a bridegroom rejoices in his bride so shall your God rejoice in you." },
      psalm:  { ref: "Psalm 89",              blurb: "Forever I will sing the goodness of the Lord." },
      gospel: { ref: "Matthew 1:1–25",        blurb: "She will bear a son and you shall name him Jesus.",
                text: "Now this is how the birth of Jesus Christ came about. When his mother Mary was betrothed to Joseph, but before they lived together, she was found with child through the Holy Spirit." },
    },
  },
  "2026-12-25": {
    weekday: "Friday", liturgicalDate: "The Nativity of the Lord — Christmas",
    season: "Christmas", rank: "Solemnity",
    feast: { name: "The Nativity of the Lord", years: "—", feastDay: "December 25",
      line: "Christmas. God became man and dwelt among us. The Word made flesh in a manger.",
      verse: "And the Word became flesh and made his dwelling among us.", verseRef: "John 1:14" },
    readings: {
      first:  { ref: "Isaiah 52:7–10",        blurb: "All the ends of the earth will behold the salvation of our God." },
      psalm:  { ref: "Psalm 98",              blurb: "All the ends of the earth have seen the saving power of God." },
      gospel: { ref: "John 1:1–18",           blurb: "And the Word became flesh and made his dwelling among us.",
                text: "In the beginning was the Word, and the Word was with God, and the Word was God. He was in the beginning with God. All things came to be through him, and without him nothing came to be." },
    },
  },
  "2026-12-26": {
    weekday: "Saturday", liturgicalDate: "Feast of St. Stephen, Protomartyr",
    season: "Christmas", rank: "Feast",
    feast: { name: "St. Stephen", years: "Martyred c. 34 AD", feastDay: "December 26",
      line: "First martyr of the Church. Stoned outside Jerusalem with the future St. Paul standing by.",
      verse: "Lord Jesus, receive my spirit. Lord, do not hold this sin against them.", verseRef: "Acts 7:59–60" },
    readings: {
      first:  { ref: "Acts 6:8–10; 7:54–59",  blurb: "I see the heavens opened and the Son of Man standing at the right hand of God." },
      psalm:  { ref: "Psalm 31",              blurb: "Into your hands, O Lord, I commend my spirit." },
      gospel: { ref: "Matthew 10:17–22",      blurb: "Whoever endures to the end will be saved.",
                text: "Jesus said to his disciples: \"Beware of people, for they will hand you over to courts and scourge you in their synagogues, and you will be led before governors and kings for my sake as a witness before them and the pagans.\"" },
    },
  },
  "2026-12-27": {
    weekday: "Sunday", liturgicalDate: "Feast of the Holy Family of Jesus, Mary and Joseph",
    season: "Christmas", rank: "Feast",
    feast: { name: "The Holy Family", years: "—", feastDay: "Sunday within the Octave of Christmas",
      line: "Jesus, Mary, and Joseph — the family of Nazareth. Pattern of every Christian home.",
      verse: "Jesus advanced in wisdom and age and favor before God and man.", verseRef: "Luke 2:52" },
    readings: {
      first:  { ref: "Sirach 3:2–6, 12–14",   blurb: "Whoever honors his father atones for sins." },
      psalm:  { ref: "Psalm 128",             blurb: "Blessed are those who fear the Lord and walk in his ways." },
      gospel: { ref: "Luke 2:41–52",          blurb: "Why were you looking for me? Did you not know that I must be in my Father's house?",
                text: "Each year Jesus' parents went to Jerusalem for the feast of Passover, and when he was twelve years old, they went up according to festival custom. After they had completed its days, as they were returning, the boy Jesus remained behind in Jerusalem, but his parents did not know it." },
    },
  },
  "2026-12-28": {
    weekday: "Monday", liturgicalDate: "Feast of the Holy Innocents, Martyrs",
    season: "Christmas", rank: "Feast",
    feast: { name: "The Holy Innocents", years: "1st century BC", feastDay: "December 28",
      line: "The boys slaughtered by Herod in his attempt to kill the Christ child. The Church's first martyrs — without choosing it.",
      verse: "A voice was heard in Ramah, weeping and great mourning, Rachel weeping for her children, and she would not be consoled.", verseRef: "Matthew 2:18" },
    readings: {
      first:  { ref: "1 John 1:5–2:2",        blurb: "If we walk in the light as he is in the light, then we have fellowship with one another." },
      psalm:  { ref: "Psalm 124",             blurb: "Our soul has been rescued like a bird from the fowler's snare." },
      gospel: { ref: "Matthew 2:13–18",       blurb: "He will be called a Nazorean.",
                text: "When the magi had departed, behold, the angel of the Lord appeared to Joseph in a dream and said, \"Rise, take the child and his mother, flee to Egypt, and stay there until I tell you.\"" },
    },
  },
};

/* Generic ferial template — used for any date not in LITURGICAL_DAYS.
   The Church's daily Mass continues without interruption; even on
   ordinary days there is a saint of the day, a Gospel, an intention.
   This fallback names the season and offers a generic Gospel reference.
   Better than nothing; replaceable by Universalis when wired. */
/* ============================================================================
   Liturgical season inference — Easter / Pentecost only.

   Most date-keyed entries in LITURGICAL_DAYS carry their own `season`.
   When a date falls through to LITURGICAL_FALLBACK, the season needs to
   be inferred from the date itself; without this, the Hub renders
   "Ordinary Time" during the 50-day Easter cycle, which is liturgically
   wrong. The implementation is intentionally minimal — Easter and
   Pentecost only. Lent / Advent / Christmas are typically served by
   explicit data file entries on their major days; this is a stopgap
   until Universalis API integration covers the full calendar.
   ============================================================================ */

// Western Easter Sunday for a given year (Gauss / Anonymous Gregorian).
function easterSundayFor(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const L = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * L) / 451);
  const month = Math.floor((h + L - 7 * m + 114) / 31); // 3 = March, 4 = April
  const day = ((h + L - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

// Pentecost = Easter Sunday + 49 days (the 50-day cycle ends on Pentecost).
function pentecostFor(year) {
  const easter = easterSundayFor(year);
  return new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + 49);
}

// Returns "Easter" if the date falls in the 50-day Easter cycle, else
// "Ordinary Time" — conservative; not aware of Lent / Advent / Christmas.
export function inferSeason(date) {
  const year = date.getFullYear();
  const t = date.getTime();
  if (t >= easterSundayFor(year).getTime() && t <= pentecostFor(year).getTime()) {
    return "Easter";
  }
  return "Ordinary Time";
}

export const LITURGICAL_FALLBACK = {
  weekday: "Today",
  liturgicalDate: "An ordinary day in the Church's year",
  season: "Ordinary Time", rank: "Ferial",
  feast: {
    name: "The Saint of the Day",
    years: "—",
    feastDay: "Today",
    line: "Today the Church remembers a saint who walked this path before you. Open the Hub's Cloud of Witnesses to meet them, or pray for the courage to live today as faithfully as they did.",
    verse: "Be faithful in small things, for it is in them that your strength lies.",
    verseRef: "St. Mother Teresa",
  },
  readings: {
    first:  { ref: "From today's Mass",      blurb: "The first reading of today's Mass — open Universalis or your missal for the full text." },
    psalm:  { ref: "From today's Mass",      blurb: "Today's responsorial psalm." },
    gospel: { ref: "From today's Mass",
              blurb: "Open today's Gospel with Lectio Divina. Read slowly. Where does it pause you?",
              text:  "Open today's Gospel passage in your missal, your Bible, or at universalis.com. Read it slowly. Notice where it pauses you. Speak to Christ from there." },
  },
};

/* The integration point. The whole app reads CHURCH_TODAY exactly as
   before; getLiturgicalDay() resolves the right entry by date and
   blends in the monthly papal intention. When Universalis is wired
   post-traction, the implementation of getLiturgicalDay() changes;
   the rest of the app does not. */
export function getLiturgicalDay(date = new Date()) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const key = `${yyyy}-${mm}-${dd}`;
  const day = LITURGICAL_DAYS[key] || LITURGICAL_FALLBACK;
  const monthIdx = date.getMonth() + 1;
  const intention = LITURGICAL_PAPAL_INTENTIONS_2026[monthIdx] ||
                    { month: "This month", text: "Pray with the universal Church for the Pope's monthly intention." };
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const dateDisplay = `${monthNames[date.getMonth()]} ${date.getDate()}, ${yyyy}`;
  const dayName = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][date.getDay()];

  // When the date keyed into LITURGICAL_FALLBACK, infer season from the
  // date itself and synthesize a sensible liturgicalDate string instead
  // of letting `undefined` render in the Hub.
  const isFallback = day === LITURGICAL_FALLBACK;
  const season = isFallback ? inferSeason(date) : day.season;
  const liturgicalDate = day.liturgicalDate ||
    `${dayName} in ${season === "Easter" ? "Easter Time" : "Ordinary Time"}`;

  return {
    weekday: day.weekday || dayName,
    date: dateDisplay,
    liturgicalDate,
    season,
    rank: day.rank,
    feast: day.feast,
    readings: day.readings,
    papalIntention: { month: intention.month, text: intention.text, issuer: "Pope Leo XIV" },
    office: {
      name: "Sext", time: "Noon",
      verse: "At noon I will pray and cry aloud, and he will hear my voice.",
      verseRef: "Psalm 55:17",
    },
  };
}

