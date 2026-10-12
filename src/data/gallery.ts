import group from '../assets/gallery/hive-group.jpg';
import energizer from '../assets/gallery/hive-energizer.jpg';
import prototype from '../assets/gallery/hive-prototype.jpg';
import breakout from '../assets/gallery/hive-breakout.jpg';
import sfDay2 from '../assets/gallery/hive-sf-day2.jpg';
import purpose from '../assets/gallery/hive-purpose.jpg';
import welcome from '../assets/gallery/hive-welcome.jpg';
import roundtable from '../assets/gallery/hive-roundtable.jpg';
import boards from '../assets/gallery/concept-boards.jpg';

// Each photo is tagged with the cognitive function it shows being practiced.
export const photos = [
  { src: group, fn: 'Connect', alt: 'A large Hive community group photo outdoors, arms raised in celebration', credit: 'Ryan M Rogers' },
  { src: roundtable, fn: 'Question', alt: 'A facilitator in a red Hive shirt leads a roundtable discussion' },
  { src: prototype, fn: 'Build', alt: 'A team builds a rapid prototype on the floor during a workshop', credit: 'Ryan M Rogers' },
  { src: purpose, fn: 'Express', alt: 'A speaker with a microphone energizes a seated audience during a purpose session' },
  { src: breakout, fn: 'Listen', alt: 'A small breakout group shares ideas with notebooks in hand', credit: 'Ryan M Rogers' },
  { src: boards, fn: 'Imagine', alt: 'Presenting urban design concept boards to visitors' },
  { src: energizer, fn: 'Energize', alt: 'Participants raise their fists during an energizer exercise', credit: 'Ryan M Rogers' },
  { src: sfDay2, fn: 'Celebrate', alt: 'Participants high-five at the start of Day 2 at Hive San Francisco' },
  { src: welcome, fn: 'Lead', alt: 'The Hive team in red shirts welcomes the community from the stage' },
];

export { group, roundtable, prototype, purpose, breakout, boards, energizer, sfDay2, welcome };
