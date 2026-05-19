/* =============================================================================
   src/data/quiz.js — the House discernment quiz.

   Six questions. Each has five answers, one weighted toward each of the
   five Houses (Light · Fire · Joy · Glory · Earth). Some
   answers carry small secondary weights to other Houses (e.g. an answer
   that's primarily Carmelite-coded but also resonates with Franciscan
   simplicity gets fire:3 + peace:1).

   The internal slug for Earth (Benedictine) is `benedict`; the internal
   slug for Joy (Franciscan) is `peace`. Display labels in HOUSES_HUB
   show "Earth" and "Joy" respectively. The slugs stayed stable so quiz
   weights and saints data did not need migration.

   The quiz component sums the weights across all six answers and surfaces
   the highest-scoring House as the user's primary. Ties surface as
   "you carry two charisms" — see HousesQuiz.jsx.
   ============================================================================= */

export const QUIZ_QUESTIONS = [
  {
    n: 1, prompt: "What draws you to faith?", sub: "Notice your first instinct, not what sounds best.",
    answers: [
      { house:"light",    text:"The questions it can answer.",          body:"You came in through the door of the mind. Or stayed through it.",                       weight:{ light:3, fire:0, benedict:0, peace:0, glory:0 } },
      { house:"fire",     text:"The longing it names.",                 body:"You came in through the door of the heart — its ache, its hope.",                        weight:{ light:0, fire:3, benedict:0, peace:1, glory:0 } },
      { house:"benedict", text:"The order it gives the day.",           body:"You came in through the door of work made prayer — daily life made holy.",               weight:{ light:0, fire:0, benedict:3, peace:1, glory:0 } },
      { house:"peace",    text:"The peace it gives.",                   body:"You came in through the door of rest — something settled in you.",                       weight:{ light:0, fire:0, benedict:1, peace:3, glory:0 } },
      { house:"glory",    text:"The challenge it issues.",              body:"You came in through the door of mission — something asked of you.",                      weight:{ light:0, fire:0, benedict:0, peace:0, glory:3 } },
    ],
  },
  {
    n: 2, prompt: "When you read Scripture, what do you most want from it?", sub: "What you reach for first, even if other things follow.",
    answers: [
      { house:"light",    text:"To understand it.",       body:"Context, meaning, how it fits with the rest. The mind first.",                       weight:{ light:3, fire:0, benedict:0, peace:0, glory:1 } },
      { house:"fire",     text:"To be moved by it.",      body:"To feel what God is saying — not just to know, but to know in love.",                weight:{ light:0, fire:3, benedict:0, peace:0, glory:0 } },
      { house:"benedict", text:"To live it today.",       body:"To take a verse into your work and your hours. Lectio that becomes labor.",          weight:{ light:0, fire:0, benedict:3, peace:1, glory:1 } },
      { house:"peace",    text:"To rest in it.",          body:"A verse to dwell with. To carry through the day, like quiet water.",                 weight:{ light:0, fire:1, benedict:1, peace:3, glory:0 } },
      { house:"glory",    text:"To be sent by it.",       body:"What does it ask? What changes? Word as marching orders.",                           weight:{ light:0, fire:0, benedict:0, peace:0, glory:3 } },
    ],
  },
  {
    n: 3, prompt: "In prayer, what do you most often seek?", sub: "The reason you sit down in the first place.",
    answers: [
      { house:"light",    text:"Clarity.",     body:"You want to see — to understand what is real, what God is doing.",                              weight:{ light:3, fire:0, benedict:0, peace:0, glory:1 } },
      { house:"fire",     text:"Intimacy.",    body:"You want to be with Him. Words optional. Presence essential.",                                  weight:{ light:0, fire:3, benedict:0, peace:1, glory:0 } },
      { house:"benedict", text:"Rhythm.",      body:"You want a daily order that holds. Hours that begin and end with God.",                          weight:{ light:0, fire:0, benedict:3, peace:1, glory:0 } },
      { house:"peace",    text:"Peace.",       body:"You want the noise to settle. The day to receive its order.",                                   weight:{ light:0, fire:0, benedict:1, peace:3, glory:0 } },
      { house:"glory",    text:"Direction.",   body:"You want to know what to do — where to go, who to serve, how.",                                 weight:{ light:1, fire:0, benedict:0, peace:0, glory:3 } },
    ],
  },
  {
    n: 4, prompt: "Whose life moves you most?", sub: "The saint whose witness lands hardest.",
    answers: [
      { house:"light",    text:"St. Thomas Aquinas.",       body:"The mind aflame with truth. Or Augustine — same fire, different age.",            weight:{ light:3, fire:0, benedict:0, peace:0, glory:0 } },
      { house:"fire",     text:"St. Teresa of Ávila.",      body:"Or Thérèse, or John of the Cross. The mystics — the heart's saints.",             weight:{ light:0, fire:3, benedict:0, peace:0, glory:0 } },
      { house:"benedict", text:"St. Benedict of Nursia.",   body:"Or his sister Scholastica. The Rule. The day made an offering. The Patriarch of the West.", weight:{ light:0, fire:0, benedict:3, peace:1, glory:0 } },
      { house:"peace",    text:"St. Francis of Assisi.",    body:"Or Clare. The poverty that was abundance. The joy that bore fruit.",            weight:{ light:0, fire:0, benedict:0, peace:3, glory:0 } },
      { house:"glory",    text:"St. Ignatius of Loyola.",   body:"Or Francis Xavier, or Joan, or Kolbe. The saints who were sent.",                 weight:{ light:0, fire:0, benedict:0, peace:0, glory:3 } },
    ],
  },
  {
    n: 5, prompt: "What is the hardest thing for you spiritually?", sub: "We are often formed by the faculty that wounds us.",
    answers: [
      { house:"light",    text:"The questioning mind.",     body:"Doubt. The need to understand before you can rest.",                              weight:{ light:3, fire:0, benedict:0, peace:0, glory:0 } },
      { house:"fire",     text:"The wounded heart.",        body:"Old hurts. Fear of intimacy. The healing that hasn't come.",                      weight:{ light:0, fire:3, benedict:0, peace:0, glory:0 } },
      { house:"benedict", text:"The disorder of my hours.", body:"Days that drift. Work that swallows prayer. The struggle to keep an ordered life.", weight:{ light:0, fire:0, benedict:3, peace:1, glory:0 } },
      { house:"peace",    text:"The restless will.",        body:"Anxiety. The inability to be still. The need to keep moving.",                    weight:{ light:0, fire:0, benedict:1, peace:3, glory:1 } },
      { house:"glory",    text:"The lack of clear calling.",body:"Drift. Wanting to give your life — but not knowing where.",                        weight:{ light:1, fire:0, benedict:0, peace:0, glory:3 } },
    ],
  },
  {
    n: 6, prompt: "What does the kingdom most need from you?", sub: "Set aside humility. What is the gift you actually carry?",
    answers: [
      { house:"light",    text:"Witness to truth.",         body:"To think clearly about what's real, and to teach others to think.",              weight:{ light:3, fire:0, benedict:0, peace:0, glory:0 } },
      { house:"fire",     text:"Hidden contemplation.",     body:"To love deeply in secret. The interior life sustains the visible.",              weight:{ light:0, fire:3, benedict:0, peace:1, glory:0 } },
      { house:"benedict", text:"The sanctification of work.", body:"To make your craft, your home, your hours into a single offering.",           weight:{ light:0, fire:0, benedict:3, peace:1, glory:0 } },
      { house:"peace",    text:"Joy and presence.",       body:"To embody — in ordinary moments, with the open hand — the joy the world cannot give.",                weight:{ light:0, fire:1, benedict:1, peace:3, glory:0 } },
      { house:"glory",    text:"Mission and leadership.",   body:"To go where others won't. To lead. To be the one who is sent.",                  weight:{ light:0, fire:0, benedict:0, peace:0, glory:3 } },
    ],
  },
];
