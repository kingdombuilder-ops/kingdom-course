/* =============================================================================
   src/data/houses.js — the Five Houses of formation.

   Two parallel views of the same five-House architecture:
     • HOUSES        — concise, slug-keyed (used by Course tab, header chips)
     • HOUSES_HUB    — fuller, with icons and body copy (used by Hub tab)

   These exist as two shapes because they grew up in two different tabs;
   over time they should be unified into a single House record per slug.
   For now both ship; consumers pick whichever shape they need.

   HOUSE_QUOTES carries seven quotes per House for daily rotation. The
   index is computed once on module load so the same saint speaks for
   the whole day.

   Slug `benedict` is the internal key for what the user sees as "Earth"
   (House of Earth, patron St. Benedict, *ora et labora*). The display
   label is "Earth"; the slug stays `benedict` so quiz weights and saint
   data don't need to change.
   ============================================================================= */

import { Brain, Flame, Hammer, Hand, Zap } from 'lucide-react';

/* The Five Houses — concise shape. Slug-keyed for direct lookup. */
export const HOUSES = {
  light: {
    slug: "light", name: "Light",
    color: "#D7B169", tint: "rgba(215,177,105,0.10)", glow: "rgba(215,177,105,0.45)",
    patron: "St. Thomas Aquinas",
    tradition: "Dominican",
    charism: "Truth · Intellect",
    line: "For minds that crave the architecture of reality. Theology, doctrine, the structure of the faith.",
  },
  fire: {
    slug: "fire", name: "Fire",
    color: "#8C2A2A", tint: "rgba(140,42,42,0.10)", glow: "rgba(140,42,42,0.40)",
    patron: "St. Teresa of Ávila",
    tradition: "Carmelite",
    charism: "Love · Contemplation",
    line: "For hearts pulled toward the silence where God speaks. The interior castle, the dark night, the bridal mystery.",
  },
  peace: {
    slug: "peace", name: "Joy",
    color: "#5C7A3A", tint: "rgba(92,122,58,0.10)", glow: "rgba(92,122,58,0.35)",
    patron: "St. Francis of Assisi",
    tradition: "Franciscan",
    charism: "Joy · Poverty",
    line: "For souls who suspect the deepest truth of the kingdom is joy. The herald of the Great King. The leper kissed. The host received with wonder. *For the joy set before him, he endured the cross.*",
  },
  glory: {
    slug: "glory", name: "Glory",
    color: "#4A5F7E", tint: "rgba(74,95,126,0.10)", glow: "rgba(74,95,126,0.35)",
    patron: "St. Ignatius of Loyola",
    tradition: "Ignatian",
    charism: "Mission · Leadership",
    line: "For those built to lead, build, send. Discernment, mission, the magis. Saints who form saints.",
  },
  benedict: {
    slug: "benedict", name: "Earth",
    color: "#5C4A2E", tint: "rgba(92,74,46,0.10)", glow: "rgba(92,74,46,0.40)",
    patron: "St. Benedict of Nursia",
    tradition: "Benedictine",
    charism: "Work · Ora et labora",
    line: "For those whose prayer is bound up with their work. Stability, hospitality, the sanctification of ordinary life. The lay vocation made holy.",
  },
};
export const HOUSE_LIST = Object.values(HOUSES);

export const HOUSES_HUB = {
  light: {
    name: "Light", color: "#D7B169", tint: "rgba(215,177,105,0.10)", glow: "rgba(215,177,105,0.45)",
    icon: Brain, motto: "Veritas",
    patron: "St. Thomas Aquinas", tradition: "Dominican",
    charism: "Truth · Intellect", faculty: "the mind",
    body: "The Light forms saints whose minds have been conformed to truth. The Dominican word — Veritas. For those who burn with the question: what is real?",
    fitWhy: "You are drawn to truth. You want to understand what you believe — not as scaffolding for feeling, but as the foundation of feeling. Doubt for you is a path, not an obstacle. The kingdom needs your intellect.",
  },
  fire: {
    name: "Fire", color: "#8C2A2A", tint: "rgba(140,42,42,0.10)", glow: "rgba(140,42,42,0.45)",
    icon: Flame, motto: "Nada te turbe",
    patron: "St. Teresa of Ávila", tradition: "Carmelite",
    charism: "Love · Contemplation", faculty: "the heart",
    body: "The Fire is where the wounded heart is healed and the purified heart catches flame. The Interior Castle. The dark night walked through, not around.",
    fitWhy: "You long for intimacy with God. The interior life is the real life for you. You have known the dark night, or sense it coming, and refuse to flinch. The kingdom needs your heart.",
  },
  peace: {
    name: "Joy", color: "#5C7A3A", tint: "rgba(92,122,58,0.10)", glow: "rgba(92,122,58,0.45)",
    icon: Hand, motto: "Pax et bonum",
    patron: "St. Francis of Assisi", tradition: "Franciscan",
    charism: "Joy · Poverty", faculty: "the open hand",
    body: "The House of Joy forms saints who have learned that joy is the deepest truth — deeper than peace, deeper than comfort, deeper than the cross itself. *For the joy set before him, he endured the cross.* Lady Poverty. The leper kissed. The herald of the Great King singing in the rain. Humility before the host as humility before the manger — Francis's gift to the whole Church. The altar where joy becomes presence. *Pax et bonum.*",
    fitWhy: "You suspect joy is on the far side of letting go. Your gift is the open hand — to the poor, to the wounded, to whoever the Spirit places in front of you today. You proclaim by giving. The kingdom needs your joy.",
  },
  glory: {
    name: "Glory", color: "#4A5F7E", tint: "rgba(74,95,126,0.10)", glow: "rgba(74,95,126,0.45)",
    icon: Zap, motto: "Ad Maiorem Dei Gloriam",
    patron: "St. Ignatius of Loyola", tradition: "Ignatian",
    charism: "Mission · Leadership", faculty: "courage in action",
    body: "The Glory is where the calling ignites. Discernment, courage, apostolic fire. Ignatius's Spiritual Exercises — strategy meets surrender.",
    fitWhy: "You feel the pull of mission. You want your life to count for something — concretely, for the kingdom. You discern, then you go. The kingdom needs your courage.",
  },
  benedict: {
    name: "Earth", color: "#5C4A2E", tint: "rgba(92,74,46,0.10)", glow: "rgba(92,74,46,0.45)",
    icon: Hammer, motto: "Ora et labora",
    patron: "St. Benedict of Nursia", tradition: "Benedictine",
    charism: "Work · Stability", faculty: "the hands",
    body: "The House of Earth forms saints whose prayer and work have become one act. Grounded. The Rule. Stability of place. Hospitality at the threshold. The sanctification of ordinary life — the lay vocation of the worker, the parent, the maker, the host. The Benedictine charism: God met in the soil, in the hours, in the daily bread.",
    fitWhy: "You suspect the kingdom is built in the small loyalties of ordinary work. You want to make your day a single offering — your craft, your home, your hours. You believe stability is a virtue. The kingdom needs your hands.",
  },
};

/* House quotes — daily rotation. When the user has discerned a house,
   the Hub greets them each day with a short word from one of the
   saints walking with them. Seven quotes per house, rotated by date,
   so the same saint speaks roughly once a week. */
export const HOUSE_QUOTES = {
  light: [
    { text: "To one who has faith, no explanation is necessary. To one without faith, no explanation is possible.",        saint: "St. Thomas Aquinas" },
    { text: "We must love them both — those whose opinions we share and those whose opinions we reject. For both have laboured in the search for truth.", saint: "St. Thomas Aquinas" },
    { text: "Be who God meant you to be and you will set the world on fire.",                                                saint: "St. Catherine of Siena" },
    { text: "Nothing great is ever achieved without much enduring.",                                                          saint: "St. Catherine of Siena" },
    { text: "You have made us for yourself, O Lord, and our heart is restless until it rests in you.",                       saint: "St. Augustine" },
    { text: "Faith is to believe what you do not see; the reward of this faith is to see what you believe.",                  saint: "St. Augustine" },
    { text: "Truth is so obscure in these times, and falsehood so established, that, unless we love the truth, we cannot know it.", saint: "Blaise Pascal" },
  ],
  fire: [
    { text: "Let nothing disturb you. Let nothing frighten you. All things pass. God does not change. Patience obtains all things. Whoever has God lacks nothing — God alone is enough.", saint: "St. Teresa of Ávila" },
    { text: "More tears are shed over answered prayers than unanswered ones.",                                                saint: "St. Teresa of Ávila" },
    { text: "In the evening of life, we will be judged on love alone.",                                                       saint: "St. John of the Cross" },
    { text: "To come to the pleasure you have not, you must go by a way in which you enjoy not.",                            saint: "St. John of the Cross" },
    { text: "Miss no single opportunity of making some small sacrifice — by a smiling look, by a kindly word, by always doing the smallest right thing — and doing it all for love.", saint: "St. Thérèse of Lisieux" },
    { text: "Pray, hope, and don't worry.",                                                                                   saint: "St. Padre Pio" },
    { text: "What we are is God's gift to us. What we become is our gift to God.",                                            saint: "St. Edith Stein" },
  ],
  peace: [
    { text: "Start by doing what is necessary, then what is possible — and suddenly you are doing the impossible.",          saint: "St. Francis of Assisi" },
    { text: "Preach the Gospel at all times. When necessary, use words.",                                                     saint: "St. Francis of Assisi" },
    { text: "Where there is hatred, let me sow love. Where there is doubt, faith. Where there is despair, hope.",            saint: "St. Francis of Assisi" },
    { text: "Not all of us can do great things. But we can do small things with great love.",                                 saint: "St. Mother Teresa" },
    { text: "If you judge people, you have no time to love them.",                                                            saint: "St. Mother Teresa" },
    { text: "Find God in all things.",                                                                                        saint: "St. Ignatius (echoed by St. Francis)" },
    { text: "Give to every creature what is due — to God, the things of God, and to your brother and sister, your peace.",   saint: "St. Clare of Assisi" },
  ],
  glory: [
    { text: "Go forth and set the world on fire.",                                                                            saint: "St. Ignatius of Loyola" },
    { text: "Pray as if everything depended on God; act as if everything depended on you.",                                   saint: "St. Ignatius of Loyola" },
    { text: "Teach us, good Lord, to serve you as you deserve — to give and not to count the cost.",                          saint: "St. Ignatius of Loyola" },
    { text: "I have come to set the world on fire, and how I wish it were already kindled.",                                  saint: "Christ, in Luke 12:49" },
    { text: "Be not afraid! Open wide the doors for Christ.",                                                                 saint: "St. John Paul II" },
    { text: "Have courage and do not be afraid.",                                                                             saint: "St. Francis Xavier" },
    { text: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",               saint: "St. Paul, Colossians 3:23" },
  ],
  benedict: [
    { text: "Ora et labora — pray and work.",                                                                                  saint: "St. Benedict of Nursia" },
    { text: "Listen carefully, my son, to the master's instructions, and attend to them with the ear of your heart.",         saint: "Rule of St. Benedict, Prologue" },
    { text: "Let all guests who arrive be received like Christ, for he is going to say, 'I came as a guest, and you received me.'", saint: "Rule of St. Benedict, ch. 53" },
    { text: "Idleness is the enemy of the soul. Therefore, the brothers and sisters should be occupied at certain times in manual labor, and at other times in spiritual reading.", saint: "Rule of St. Benedict, ch. 48" },
    { text: "Receive in silence, and answer in fewer words than you are asked.",                                              saint: "St. Benedict of Nursia" },
    { text: "Through work, the human being shares in the act of the Creator, and continues to develop it.",                  saint: "St. John Paul II, Laborem exercens" },
    { text: "Whatever you do, in word or in deed, do everything in the name of the Lord Jesus.",                              saint: "St. Paul, Colossians 3:17" },
  ],
};
export const TODAY_HOUSE_QUOTE_INDEX = (new Date()).getDate() % 7;
