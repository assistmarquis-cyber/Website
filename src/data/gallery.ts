import group from '../assets/gallery/hive-group.jpg';
import energizer from '../assets/gallery/hive-energizer.jpg';
import prototype from '../assets/gallery/hive-prototype.jpg';
import breakout from '../assets/gallery/hive-breakout.jpg';
import sfDay2 from '../assets/gallery/hive-sf-day2.jpg';
import purpose from '../assets/gallery/hive-purpose.jpg';
import welcome from '../assets/gallery/hive-welcome.jpg';
import roundtable from '../assets/gallery/hive-roundtable.jpg';
import boards from '../assets/gallery/concept-boards.jpg';
import selfie from '../assets/life/selfie-on-the-move.jpg';
import light from '../assets/life/chasing-the-light.jpg';
import classroom from '../assets/life/classroom-leopard-den.jpg';
import whiteboard from '../assets/life/whiteboard-solution-for-who.jpg';
import reading from '../assets/life/reading-psycho-cybernetics.jpg';
import panel from '../assets/life/signature-society-panel.jpg';
import room from '../assets/life/signature-society-room.jpg';
import visionBoards from '../assets/life/vision-board-workshop.jpg';
import crew from '../assets/life/with-the-crew.jpg';
import afterSession from '../assets/life/after-the-session.jpg';

// Each photo is tagged with the cognitive function it shows being practiced.
// cap is the caption shown under the photo. Name Marquis only where he is in the shot.
export const photos = [
  { src: classroom, fn: 'Teach', cap: 'Drawing up the play at W.H. Adamson High', alt: 'Teaching a high school class, sketching a game plan on a smart board labeled Leopard Den' },
  { src: group, fn: 'Connect', cap: 'The Hive community at Harvard', alt: 'The Hive community at Harvard, a large group photo outdoors with arms raised in celebration', credit: 'Ryan M Rogers' },
  { src: selfie, fn: 'Laugh', cap: 'Caught mid-laugh between rooms', alt: 'A blurry, laughing selfie in a teal beanie and glasses' },
  { src: roundtable, fn: 'Question', cap: 'Marquis facilitating a small-group roundtable at Hive', alt: 'Marquis Harmon, in a red Hive shirt, facilitating a small-group roundtable discussion at Hive' },
  { src: whiteboard, fn: 'Decide', cap: 'Solution for who?', alt: 'A whiteboard full of strategy notes on a living wage, small-business owners and pre-production planning' },
  { src: prototype, fn: 'Build', cap: 'Rapid prototyping on the floor at Hive', alt: 'A Hive team building a rapid prototype on the floor', credit: 'Ryan M Rogers' },
  { src: visionBoards, fn: 'Envision', cap: 'Vision boards: see it before you build it', alt: 'A long table of people cutting and pasting magazine images into vision boards' },
  { src: purpose, fn: 'Express', cap: 'Marquis energizing the room at a Hive purpose session', alt: 'Marquis Harmon, mic in hand, energizing a seated audience during a Hive purpose session' },
  { src: light, fn: 'Become', cap: 'Chasing the light', alt: 'Black-and-white low-angle portrait of a man in a patterned headwrap holding a light overhead' },
  { src: breakout, fn: 'Listen', cap: 'A small-group breakout at Hive', alt: 'A small breakout group at Hive sharing ideas, notebooks in hand', credit: 'Ryan M Rogers' },
  { src: room, fn: 'Gather', cap: 'A full room at Signature Society', alt: 'A full lounge audience listening at a Signature Society event at Royal Palace' },
  { src: boards, fn: 'Imagine', cap: 'Marquis walking visitors through urban design concept boards', alt: 'Marquis Harmon, in a red shirt, walking visitors through urban design concept boards' },
  { src: reading, fn: 'Study', cap: 'Current re-read: Psycho-Cybernetics', alt: 'A hand holding a worn copy of Psycho-Cybernetics by Maxwell Maltz over green turf' },
  { src: energizer, fn: 'Energize', cap: 'An energizer at Hive', alt: 'Hive participants raise their fists during an energizer exercise', credit: 'Ryan M Rogers' },
  { src: panel, fn: 'Converse', cap: 'Panel night at Royal Palace', alt: 'A moderator with a microphone in front of a seated panel at Signature Society, Royal Palace' },
  { src: sfDay2, fn: 'Celebrate', cap: 'Marquis kicking off Day 2 at Hive San Francisco', alt: 'Marquis Harmon and participants high-fiving to kick off Day 2 at Hive San Francisco' },
  { src: crew, fn: 'Belong', cap: 'With the crew', alt: 'Four friends posing together in a gallery space with gold curtains' },
  { src: welcome, fn: 'Lead', cap: 'Marquis and the Hive team welcoming the community', alt: 'Marquis Harmon and the Hive team, in red shirts, welcoming the community from the stage' },
  { src: afterSession, fn: 'Follow up', cap: 'The talk after the talk', alt: 'Guests deep in conversation after an evening session' },
];

export { group, roundtable, prototype, purpose, breakout, boards, energizer, sfDay2, welcome };
