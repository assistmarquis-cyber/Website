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
// cap is the caption shown under the photo. Name Marquis only where he is in the shot.
export const photos = [
  { src: group, fn: 'Connect', cap: 'The Hive community at Harvard', alt: 'The Hive community at Harvard, a large group photo outdoors with arms raised in celebration', credit: 'Ryan M Rogers' },
  { src: roundtable, fn: 'Question', cap: 'Marquis facilitating a small-group roundtable at Hive', alt: 'Marquis Harmon, in a red Hive shirt, facilitating a small-group roundtable discussion at Hive' },
  { src: prototype, fn: 'Build', cap: 'Rapid prototyping on the floor at Hive', alt: 'A Hive team building a rapid prototype on the floor', credit: 'Ryan M Rogers' },
  { src: purpose, fn: 'Express', cap: 'Marquis energizing the room at a Hive purpose session', alt: 'Marquis Harmon, mic in hand, energizing a seated audience during a Hive purpose session' },
  { src: breakout, fn: 'Listen', cap: 'A small-group breakout at Hive', alt: 'A small breakout group at Hive sharing ideas, notebooks in hand', credit: 'Ryan M Rogers' },
  { src: boards, fn: 'Imagine', cap: 'Marquis walking visitors through urban design concept boards', alt: 'Marquis Harmon, in a red shirt, walking visitors through urban design concept boards' },
  { src: energizer, fn: 'Energize', cap: 'An energizer at Hive', alt: 'Hive participants raise their fists during an energizer exercise', credit: 'Ryan M Rogers' },
  { src: sfDay2, fn: 'Celebrate', cap: 'Marquis kicking off Day 2 at Hive San Francisco', alt: 'Marquis Harmon and participants high-fiving to kick off Day 2 at Hive San Francisco' },
  { src: welcome, fn: 'Lead', cap: 'Marquis and the Hive team welcoming the community', alt: 'Marquis Harmon and the Hive team, in red shirts, welcoming the community from the stage' },
];

export { group, roundtable, prototype, purpose, breakout, boards, energizer, sfDay2, welcome };
