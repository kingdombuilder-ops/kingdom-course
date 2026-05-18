/* =============================================================================
   src/data/gospel.js — The Gospel tab's content database.

   Data for the visitor-facing "Gate" tab — the conversion-first landing
   that walks readers through the nine concentric circles of evidence
   for the Catholic faith, from the King at center radiating outward to
   the kingdom's outer ring.

   Structure:

     RING_COLORS — array of 9 hex strings, gold-spectrum gradient
       Used by the Circles SVG visualization (innermost rings darker,
       outermost lighter) and the Bridge component which mirrors the same
       circles compressed to show the path's center.

     CIRCLES — array of 9 circle objects:
       n        — 1..9
       title    — e.g. "The King"
       subtitle — short descriptor (e.g. "The Resurrection and the Living Christ")
       essence  — paragraph-length introduction
       pillars  — array of 4 { k, v } pairs: title + body
       evidence — array of supplementary { name, body } items
       scripture — closing scripture quote with citation
       reflection? — array of contemplative questions
       prayer?     — closing prayer text

   Migrated from the_kingdom.jsx lines 4774-4969 (CIRCLES) and
   4971 (RING_COLORS) verbatim. Only `const` → `export const`.

   Bundle note: ~21 KB raw / ~6-8 KB gzipped. Small enough to stay in the
   main bundle without causing payload concerns. The Gospel tab is the
   visitor's first stop — it should load fast, and these 9 circles ARE
   the page's content.
   ============================================================================= */

export const RING_COLORS = ["#F4D98C", "#ECC56C", "#D7B169", "#C69A52", "#B5883F", "#9A7334", "#8A6828", "#6F5220", "#574019"];

export const CIRCLES = [
  {
    n: 1,
    title: "The King",
    subtitle: "The Resurrection and the Living Christ",
    essence: "Everything begins here. If Jesus of Nazareth rose from the dead, he is who he claimed to be — and every circle that follows is the trail of his kingdom.",
    pillars: [
      { k: "The Empty Tomb", v: "Discovered by women — a detail no first-century forger would invent. Friends and enemies agreed: the body was gone." },
      { k: "The Appearances", v: "To individuals, small groups, and a crowd of over 500. Paul’s creed (1 Cor 15) is dated within two to five years of the event — devastatingly early." },
      { k: "The Transformed Disciples", v: "Cowards became martyrs. People die for what they believe is true. No one dies for what they know is fabricated." },
      { k: "The Birth of the Church", v: "A crucified criminal became the most worshipped figure in human history. No rival explanation accounts for the evidence." },
    ],
    evidence: [
      { name: "The Shroud of Turin", body: "The most studied artifact in history. An image that is not painted, dyed, printed, or burned — a surface discoloration twenty micrometers deep that no modern technology can reproduce. A photographic negative four centuries before photography. Three-dimensional distance data decoded by NASA's VP-8 Analyzer. Type-AB human blood, anatomically accurate, matching the Eucharistic miracles of Lanciano and Buenos Aires. The best scientific hypothesis: a brief, uniform burst of radiation from inside the cloth." },
      { name: "The Stigmata", body: "For two thousand years, the wounds of Christ have appeared on the bodies of his closest followers. Francis of Assisi (1224). Padre Pio — fifty years of bleeding wounds, documented by physicians, filmed, investigated. The King's wounds, still speaking." },
    ],
    scripture: "“I am the Alpha and the Omega, the First and the Last, the Beginning and the End.” — Revelation 22:13",
    reflection: [
      "If Jesus truly rose from the dead, what in your life would have to change?",
      "Which of the four pillars of evidence is most arresting to you? Which is most resistible?",
      "Is there a specific room in your life you have kept locked against the risen King?",
    ],
    prayer: "Risen King, if you are alive — alive now, alive as you were the morning the women found the tomb empty — meet me in the room where I have hidden. I cannot open the door. Come through it. Amen.",
  },
  {
    n: 2,
    title: "The Presence",
    subtitle: "The Eucharist and the Heart That Will Not Stop Beating",
    essence: "The King did not leave. He remains — bread, become flesh; wine, become blood. The evidence for this is not theological. It is pathological. It has been examined under microscopes.",
    pillars: [
      { k: "Lanciano, 750 AD", v: "Consecrated host transformed into flesh and blood during Mass. In 1970, Dr. Odoardo Linoli identified it: human cardiac muscle, left ventricle. Blood type AB. After 1,250 years — unpreserved, unembalmed — still present." },
      { k: "Buenos Aires, 1996", v: "Under Cardinal Jorge Bergoglio — later Pope Francis (2013–2025). Forensic pathologist Dr. Frederick Zugibe analyzed the tissue blind. His conclusion: inflamed myocardium from a man tortured to death — who was still alive when sampled." },
      { k: "Sokółka & Tixtla", v: "Poland, 2008. Mexico, 2006. Independent forensic analyses, different continents, same result: human cardiac tissue, intertwined with the bread fibers at a cellular level. Impossible to fake. Impossible to explain." },
    ],
    evidence: [
      { name: "The Fasting Saints", body: "Marthe Robin lived for fifty years consuming nothing but the weekly Eucharist. Alexandrina da Costa: thirteen years, only the Host. Medically supervised, confined to bed, investigated. The body was sustained by something that is not bread." },
      { name: "The Pattern", body: "Over 150 documented Eucharistic miracles across twelve centuries, five continents, many languages. When tested: every sample that has been analyzed is cardiac muscle, often from the left ventricle — the heart that labors. Type AB blood, consistently. The same blood as the Shroud." },
    ],
    scripture: "“Unless you eat the flesh of the Son of Man and drink his blood, you have no life in you.” — John 6:53",
    reflection: [
      "If Christ is truly present in the Eucharist, what would a fitting response look like for you?",
      "What would change in a Catholic church if everyone there believed what the Church teaches about what is on the altar?",
      "Where is the nearest tabernacle to where you are right now? When will you sit before it?",
    ],
    prayer: "Lord Jesus, truly present — in bread I cannot see through, in a Host I have walked past a thousand times — give me eyes to see. Give me knees to kneel. Give me the silence that lets me hear you breathe. Amen.",
  },
  {
    n: 3,
    title: "The Queen",
    subtitle: "Mary, the Gebirah, the Mother Who Warns and Weeps",
    essence: "In the Davidic kingdom, the Queen was not the wife of the king — she was his mother. She sat at his right hand. She interceded. She is still doing it.",
    pillars: [
      { k: "Guadalupe, 1531", v: "A tilma of cactus fiber — expected lifespan twenty years — still intact after almost 500. Image un-paintable, pigments uncategorized, eyes containing microscopic reflections of figures present in 1531. Result: nine million conversions in seven years. The most explosive evangelization in history." },
      { k: "Lourdes, 1858", v: "Seventy-two medically verified healings. A review panel including non-Catholic doctors. Standards as rigorous as any clinical trial. Instantaneous, complete, permanent. Sister Bernadette Moriau, paralyzed for decades — healed in 2008. Declared miraculous in 2018." },
      { k: "Fatima, 1917", v: "Three children. A prediction, three months in advance, of a public sign. On October 13, at the announced hour, 70,000 people — believers, atheists, journalists — watched the sun dance and plunge toward the earth. The soaked crowd and ground instantly dried. Witnessed forty kilometers away." },
    ],
    evidence: [
      { name: "Kibeho, 1981", body: "Rwanda. Three young women see Mary weeping over rivers of blood, piles of bodies, a land aflame. Approved by the Church in 2001. Three years later, the genocide erupted — in the very region of the apparitions. The Queen Mother had come to warn." },
      { name: "The Pattern", body: "Consistency of message: prayer, penance, conversion, the rosary, the Eucharist, obedience to the Pope. Structural fidelity: she never contradicts the Church. Prophetic accuracy: World War II, Soviet Communism, the Rwandan genocide — predicted before they happened. She always points to her Son." },
    ],
    scripture: "“Behold, your mother.” — John 19:27",
    reflection: [
      "What was your reaction to the evidence around Mary? Resistance? Relief? Surprise?",
      "If Mary is the Queen Mother of the King's kingdom, what is she doing right now?",
      "Is there someone in your life who needs her prayers more than yours?",
    ],
    prayer: "Holy Mary, Mother of the King — if you are who the Church says you are, Queen Mother, refuge of sinners, intercessor — pray for me now, at this hour. Bring me to your Son. Amen.",
  },
  {
    n: 4,
    title: "The Steward",
    subtitle: "The Keys and the Indestructible Office",
    essence: "Jesus quoted Isaiah 22 when he gave Peter the keys — installing him in the Davidic office of royal steward. The office was made to outlast the man. It has outlasted 266 men.",
    pillars: [
      { k: "2,000 Years, One Office", v: "The longest-running continuous institution on earth. No empire, dynasty, university, or government has survived this. 266 popes, one succession, unbroken." },
      { k: "The Survivors' Ledger", v: "Roman emperors — dust. Arianism — extinct. Napoleon — a rock in the South Atlantic. The Soviet Union — collapsed. The papacy endures. Every power that set out to destroy it has itself been destroyed." },
      { k: "Doctrinal Coherence", v: "In two millennia, no pope has ever formally defined a doctrine contradicting another. Through popes of genius and popes of scandal, the formal teaching has never broken. No university, no academy, no tradition has matched this." },
    ],
    evidence: [
      { name: "May 13, 1981", body: "Mehmet Ali Ağca fires at John Paul II at close range. The bullet passes through his abdomen, missing the aorta by millimeters on a trajectory surgeons called medically improbable. The date is the anniversary of the first Fatima apparition. John Paul credited the Queen. The bullet is now set in her crown." },
    ],
    scripture: "“And I tell you, you are Peter, and on this rock I will build my church, and the gates of hell shall not prevail against it.” — Matthew 16:18",
    reflection: [
      "Why do you think the papacy has survived where no other ancient institution has?",
      "What does it mean that the King left a visible successor? What would it mean if he had not?",
      "Have you ever been hurt by the institutional Church? What would it take to let that hurt soften?",
    ],
    prayer: "Lord Jesus, you gave Peter the keys. You promised the gates of hell would not prevail. Help me trust your word more than my wounds, your promise more than my cynicism. Amen.",
  },
  {
    n: 5,
    title: "The Priests",
    subtitle: "The Supernatural Priesthood and the Seven Sacraments",
    essence: "The priest acts in persona Christi — in the person of Christ himself. This would be the most outrageous arrogance in history — if it were not supported by evidence.",
    pillars: [
      { k: "The Curé of Ars", v: "Nearly failed seminary. Sent to a village of no account. Within years, all Europe travelled to his confessional. He saw souls — knew penitents' sins before they spoke, named events in distant cities, described private thoughts never voiced. His body lies incorrupt, 166 years later." },
      { k: "Padre Pio", v: "Stigmata for fifty years. Bilocation — appearing in two distant cities simultaneously, confirmed by named witnesses. The reading of souls. The odor of sanctity, reported by thousands. Medical examinations on file. Vatican investigations concluded." },
      { k: "Joseph of Cupertino", v: "Levitation on more than seventy documented occasions, witnessed by cardinals, bishops, a pope, and a king. The witnesses are named. The records survive. The Church canonized him only after exhaustive investigation." },
    ],
    evidence: [
      { name: "The Evidence Hidden in Plain Sight", body: "Every one of the 150+ documented Eucharistic miracles occurred through a validly ordained Catholic priest during or immediately after Mass. Not once in two thousand years has this phenomenon been documented at a Protestant communion service. The transformation tracks the ordination with precision." },
      { name: "The Pattern of Power", body: "The most supernaturally gifted priests were often the least naturally gifted. Vianney nearly failed seminary. Cupertino was called 'the Dunce.' Mandić had a severe speech impediment and stood five feet tall. The power did not come from the man. It came from the office." },
    ],
    scripture: "“Truly I tell you, whatever you bind on earth will be bound in heaven.” — Matthew 18:18",
    reflection: [
      "What would change if you believed the priest in your town could absolve your sins in the name of Christ?",
      "Which of the seven sacraments do you most need this week?",
      "What has kept you from Confession, and what will you do about it now?",
    ],
    prayer: "Lord, I do not fully understand the priesthood. But I believe you are the priest behind every priest. Forgive me. Feed me. Anoint me. Send me. Amen.",
  },
  {
    n: 6,
    title: "The Citizens",
    subtitle: "The Saints — The Communion of the Living and the Dead",
    essence: "In the kingdom, death does not sever. The saints are alive. They pray. They appear. Their bodies, in hundreds of cases, refuse to decay.",
    pillars: [
      { k: "The Incorruptibles", v: "Hundreds of saints whose bodies have not decayed — some for over a millennium — without embalming, without preservation, in conditions where natural bodies rot in weeks. Bernadette of Lourdes, visible today in Nevers. Catherine Labouré, flexible after 57 years in the earth. Padre Pio, Vianney, Clare, many more." },
      { k: "The Levitators", v: "Joseph of Cupertino (seventy witnessed cases). Teresa of Ávila — lifted during prayer, witnessed by her sisters, attempting to hold herself down. Martin de Porres, Peter of Alcántara. The Church keeps records. The witnesses were questioned. The cases were investigated." },
      { k: "The Bilocators", v: "Padre Pio, seen in two distant cities at the same hour. Martin de Porres, appearing in Japan and China while his body remained in Lima — years before he could have travelled there. The phenomenon is documented, repeated, and inexplicable by any natural cause." },
    ],
    evidence: [
      { name: "Canonization Miracles", body: "Every saint is canonized on the basis of two investigated miracles attributed to their intercession after death. The medical board includes non-Catholic physicians. The standard is 'medically inexplicable.' The devil's advocate argues against. Thousands of such miracles have been formally verified. Each is a data point. Each is a citizen, still at work." },
    ],
    scripture: "“We are surrounded by so great a cloud of witnesses.” — Hebrews 12:1",
    reflection: [
      "Who is one saint whose life makes the Catholic claim unmistakable to you?",
      "If the saints are alive and praying for you right now, what do you ask them for?",
      "Which saint do you sense God is placing in your path today?",
    ],
    prayer: "All you saints of God, pray for me. Not as a formula — as a reality. You who see him now, turn your faces toward me, and draw me into the light you already live in. Amen.",
  },
  {
    n: 7,
    title: "The Temple",
    subtitle: "Sacred Space, Sacred Time, and the Liturgy as Cosmic Event",
    essence: "Every Catholic church is a Davidic temple — nave, sanctuary, tabernacle, altar, lamp. The liturgy is not a memorial. It is heaven pressing through earth.",
    pillars: [
      { k: "The Blood of St. Januarius", v: "Naples. A sealed reliquary of dried blood. Three times a year — on fixed liturgical dates — it liquefies. Documented since the fourteenth century. Witnessed annually by hundreds of thousands. Spectroscopic analysis confirms hemoglobin. No natural explanation. The miracle is tied to the calendar itself." },
      { k: "The Holy Fire of Jerusalem", v: "Every Holy Saturday, at the tomb of Christ, a flame appears. Documented since the fourth century. Witnessed by thousands every year. In its initial moments, pilgrims pass their hands through it without injury. No natural account has ever succeeded." },
      { k: "The Mass as Revelation", v: "The Book of Revelation is a liturgical text. Throne, Lamb, elders, incense, the Lamb 'standing as though slain,' the wedding feast, the sending of angels — every element mirrors the Mass with precision. When the priest raises the Host, the veil between heaven and earth is at its thinnest." },
    ],
    evidence: [
      { name: "The Queen Who Builds Temples", body: "At Guadalupe: build a church. At Lourdes: build a chapel. At Fatima: build a chapel. At Banneux, at Laus, at Akita. Mary does not merely appear. She builds. She plants permanent outposts — points of contact where the supernatural continues to operate. Ten million pilgrims to Guadalupe every year. Six million to Lourdes. Five million to Fatima." },
    ],
    scripture: "“Behold, the dwelling place of God is with man.” — Revelation 21:3",
    reflection: [
      "What is lost when worship becomes casual? What is recovered when it becomes reverent?",
      "When was the last time you walked into a church and felt the weight of heaven? What would it take to seek that again?",
      "If the Mass is what the Church says it is, what would a fitting Sunday look like for you?",
    ],
    prayer: "Lord, the Temple was your dwelling. You dwell in your Church now. Teach me to enter your house as if heaven were on the other side of the door. Because it is. Amen.",
  },
  {
    n: 8,
    title: "The City",
    subtitle: "The Indestructible Church and the Ingathering of the Nations",
    essence: "Every power that set out to destroy the Church has failed. And while it survived, it built the world everyone now takes for granted.",
    pillars: [
      { k: "The Kingdom Built Hospitals", v: "The first hospitals in history were Catholic foundations. Today, 5,500 hospitals, 18,000 clinics, 16,000 homes for the poor and elderly — the largest non-government healthcare provider on earth, with 65% in developing countries." },
      { k: "The Kingdom Built Universities", v: "Every major medieval university — Bologna, Paris, Oxford, Cambridge, Salamanca — was a Church foundation. By 1500, eighty universities. No other civilization produced anything comparable." },
      { k: "The Kingdom Built Science", v: "Copernicus (canon). Mendel (friar). Lemaître — the Big Bang (priest). Steno (bishop). Thirty-five lunar craters bear the names of Jesuit astronomers. 'Probably the largest single and longest-term patron of science in history,' writes historian Lawrence Principe." },
    ],
    evidence: [
      { name: "The Universal Kingdom", body: "'Catholic' means universal — kata holon, 'according to the whole.' 1.4 billion members. Every continent. Every culture. Augustine from North Africa, Patrick from Britain, Francis Xavier from Spain to India to Japan, Andrew Kim from Korea, Josephine Bakhita from Sudan, Kateri Tekakwitha of the Mohawk, Charles Lwanga of Uganda, Teresa from Albania serving in India. No other institution in history has achieved this combination of scope, duration, and unity." },
    ],
    scripture: "“All nations shall stream to it.” — Isaiah 2:2",
    reflection: [
      "What does the survival and universality of the Catholic Church point to, if not divine protection?",
      "Where is the Church being born today? And what is it costing those who are bringing it to birth?",
      "Are you inside this city, or outside it? If outside — what would it take to come in?",
    ],
    prayer: "Lord of the indestructible city — thank you for preserving her through every storm. Bring me inside her walls. Make me a citizen. Let me lay down my suspicions and come home. Amen.",
  },
  {
    n: 9,
    title: "The War",
    subtitle: "Exorcism and the Enemy's Testimony",
    essence: "The darkest evidence comes from the mouth of the enemy. In the rites of exorcism, the demons themselves bear witness to which kingdom holds the real authority.",
    pillars: [
      { k: "What Exorcism Reveals", v: "Supernatural knowledge — names, sins, private events never shared aloud. Superhuman strength — small persons restraining crowds. Languages never learned — classical Latin, Greek, Aramaic. Violent reaction to holy water, even when introduced covertly, unknown to the afflicted. Aversion to the sacred that causes visible distress." },
      { k: "What the Demons Confess", v: "They react to the name of Jesus, the authority of the priest, the Eucharist — above all the Eucharist. They react to the Virgin Mary; often they cannot even speak her name. They recognize a specific hierarchy of power. The hierarchy they recognize is the hierarchy of the Catholic Church." },
      { k: "A Note on Protestant Deliverance", v: "Christians of every tradition can pray against evil in Jesus' name — and see effects. Scripture confirms this. But experienced exorcists document a pattern: deliverance attempts resolve temporarily, then the affliction returns (Matthew 12:43–45), and the person comes to a Catholic exorcist. The sacraments — Confession above all, and the Eucharist — provoke the deepest terror. Fr. Amorth: 'A good confession is better than an exorcism.'" },
    ],
    evidence: [
      { name: "The Kingdom's Weapons", body: "Not carnal. The Mass. The Eucharist. The rosary. Confession. Fasting. The sacramentals. The saints. The priesthood. These are the same weapons illuminated throughout this course. The enemy confirms the arsenal." },
    ],
    scripture: "“Even the demons submit to us in your name.” — Luke 10:17",
    reflection: [
      "Why do you think the enemy fears the Catholic Church specifically?",
      "What territory in your own life have you been yielding to darkness? What does reclaiming it look like?",
      "If the war is real, are you armed?",
    ],
    prayer: "Lord Jesus Christ, cover me. Cover those I love. Drive out every shadow that has no right to be here. You have already won. Let that victory reach me tonight. Amen.",
  },
];
