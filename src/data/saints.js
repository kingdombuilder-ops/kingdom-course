/* =============================================================================
   src/data/saints.js — the Cloud of Witnesses.

   Each saint has: name, years, house slug (for filtering by tradition),
   note (a short identifying line). Used by the CloudOfWitnesses component
   in src/modals/CloudOfWitnesses.jsx and by the More-grid Houses card
   for related-saint lookup.

   Coverage: four saints per House × five Houses = twenty saints. Each
   covers a distinct historical era and spiritual register so the user
   sees range within their House's tradition.
   ============================================================================= */

export const SAINTS_HUB = [
  { name: "Thomas Aquinas",     years: "1225–1274", house: "light", note: "The Common Doctor." },
  { name: "Catherine of Siena", years: "1347–1380", house: "light", note: "Doctor of the Church. Mystic and reformer." },
  { name: "Augustine",          years: "354–430",   house: "light", note: "Confessions. The City of God." },
  { name: "Bonaventure",        years: "1217–1274", house: "light", note: "The Seraphic Doctor." },
  { name: "Teresa of Ávila",    years: "1515–1582", house: "fire",  note: "The Interior Castle. Reformer of Carmel." },
  { name: "John of the Cross",  years: "1542–1591", house: "fire",  note: "Mapper of the dark night." },
  { name: "Thérèse of Lisieux", years: "1873–1897", house: "fire",  note: "The Little Way." },
  { name: "Padre Pio",          years: "1887–1968", house: "fire",  note: "Stigmata. Bilocation." },
  { name: "Benedict of Nursia", years: "480–547",   house: "benedict", note: "Patriarch of the West. The Rule." },
  { name: "Scholastica",        years: "480–543",   house: "benedict", note: "Sister of Benedict. Foundress of women's monasticism." },
  { name: "Hildegard of Bingen", years: "1098–1179", house: "benedict", note: "Doctor of the Church. Visionary, composer, healer." },
  { name: "Bede the Venerable", years: "672–735",   house: "benedict", note: "The Father of English history." },
  { name: "Francis of Assisi",  years: "1181–1226", house: "peace", note: "Brother Sun, Sister Moon. Opened the Eucharist for all." },
  { name: "Clare of Assisi",    years: "1194–1253", house: "peace", note: "The Poor Clares." },
  { name: "Anthony of Padua",   years: "1195–1231", house: "peace", note: "Friend of the poor." },
  { name: "Joseph",             years: "1st cent.", house: "peace", note: "Foster father of Christ." },
  { name: "Ignatius of Loyola", years: "1491–1556", house: "glory", note: "The Spiritual Exercises. Ad maiorem Dei gloriam." },
  { name: "Francis Xavier",     years: "1506–1552", house: "glory", note: "From Pamplona to Goa to Japan." },
  { name: "Maximilian Kolbe",   years: "1894–1941", house: "glory", note: "Auschwitz, cell block 11." },
  { name: "Joan of Arc",        years: "1412–1431", house: "glory", note: "Seventeen years old, in armor." },
];
