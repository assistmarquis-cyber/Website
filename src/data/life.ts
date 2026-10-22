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
import portrait from '../assets/portrait.jpg';
import chicago from '../assets/portal/workshop-room-chicago.jpg';
import studio from '../assets/studio-planning.jpg';
import rigging from '../assets/portal/irl-production-stage-rigging-2.jpg';
import abp from '../assets/portal/assembly-of-black-possibilities-chicago.jpg';
import { roundtable, purpose, sfDay2, welcome, boards, group, prototype } from './gallery';

// Personal photos from Marquis's own life and work. The snapshot layer (PhotoLayer.astro) scatters
// these across every page section that has no photo of its own; the newest uploads come first.
// cap is the handwritten caption. Name Marquis only where he is confirmed in the shot.
// pos keeps the subject in frame when the snapshot crops to 4:3.
export const life = [
  { src: selfie, cap: 'Caught mid-laugh, on the way to the next room.', alt: 'A blurry, laughing selfie in a teal beanie and glasses', pos: '50% 40%' },
  { src: classroom, cap: 'Drawing up the play with the Leopard Den at W.H. Adamson High.', alt: 'Teaching a high school class, sketching a game plan on a smart board labeled Leopard Den' },
  { src: whiteboard, cap: 'Solution for who? Always the first question.', alt: 'A whiteboard full of strategy notes on a living wage, small-business owners and pre-production planning' },
  { src: light, cap: 'Chasing the light. Literally.', alt: 'Black-and-white low-angle portrait of a man in a patterned headwrap holding a light overhead', pos: '50% 55%' },
  { src: visionBoards, cap: 'Vision boards: see it before you build it.', alt: 'A long table of people cutting and pasting magazine images into vision boards' },
  { src: reading, cap: 'Current re-read: Psycho-Cybernetics. Identity first.', alt: 'A hand holding a worn copy of Psycho-Cybernetics by Maxwell Maltz over green turf' },
  { src: room, cap: 'A full room leaning in at Signature Society.', alt: 'A full lounge audience listening at a Signature Society event at Royal Palace' },
  { src: crew, cap: 'With the crew after a long night of ideas.', alt: 'Four friends posing together in a gallery space with gold curtains', pos: '50% 30%' },
  { src: panel, cap: 'Panel night at Signature Society, Royal Palace.', alt: 'A moderator with a microphone in front of a seated panel at Signature Society, Royal Palace' },
  { src: afterSession, cap: 'The best conversations happen after the session.', alt: 'Guests deep in conversation after an evening session', pos: '50% 45%' },
  { src: portrait, cap: 'Thinking it through before I say a word.', alt: 'Portrait of Marquis Harmon, chin in hand. Photo: LHT.HSE Creative Studio', pos: '50% 35%' },
  { src: chicago, cap: 'Selfie with a full room in Chicago.', alt: 'Marquis Harmon taking a selfie in front of a full workshop room in Chicago', pos: '50% 35%' },
  { src: welcome, cap: "That's me with the Hive crew, red shirts and all.", alt: 'Marquis Harmon and the Hive team, in red shirts, welcoming the community from the stage' },
  { src: roundtable, cap: "Small table, real problems. That's the whole method.", alt: 'Marquis Harmon, in a red Hive shirt, at a small-group roundtable' },
  { src: studio, cap: 'Where the plans start: a chalk wall and too much coffee.', alt: 'A chalkboard wall in the studio covered in planning notes' },
  { src: purpose, cap: 'Me, mid-story. Sitting still was never the plan.', alt: 'Marquis Harmon, mic in hand, energizing a seated audience at a Hive session' },
  { src: rigging, cap: 'Behind the scenes with the IRL Productions crew.', alt: 'The IRL Productions crew on the floor rigging a stage' },
  { src: sfDay2, cap: 'Fair warning: I celebrate your first win like this.', alt: 'Marquis Harmon high-fiving participants to kick off Day 2 at Hive San Francisco' },
  { src: boards, cap: 'Walking people through the picture, board by board.', alt: 'Marquis Harmon, in a red shirt, walking visitors through urban design concept boards' },
  { src: abp, cap: 'With the Assembly of Black Possibilities, Chicago.', alt: 'A group gathered with the Assembly of Black Possibilities in Chicago' },
  { src: prototype, cap: 'Building it on the floor, same day.', alt: 'A Hive team building a rapid prototype on the floor' },
  { src: group, cap: 'The Hive community at Harvard.', alt: 'The Hive community at Harvard, a large group photo outdoors with arms raised' },
];

export { selfie, light, classroom, whiteboard, reading, panel, room, visionBoards, crew, afterSession };
