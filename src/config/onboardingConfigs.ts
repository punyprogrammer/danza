import { YoureAllSetConfig } from '../components/onboarding/YoureAllSetScreen';

export const dancerCompletionConfig: YoureAllSetConfig = {
  title: "You're all set to dance!",
  subtitle: "Your dancer profile is complete",
  description: "You're all set to start exploring the dance scene and connecting with other dancers. Get ready to make some moves!",
  buttonText: "Start Dancing",
  illustrationText: {
    main: "DANCE",
    sub: "READY"
  }
};

export const organizerCompletionConfig: YoureAllSetConfig = {
  title: "Your event is ready to go!",
  subtitle: "Your organizer profile is complete",
  description: "You're all set to start promoting your event and connecting with dancers. Get ready to make some moves!",
  buttonText: "Start Promoting",
  illustrationText: {
    main: "DANCE EVENT",
    sub: "PROOF"
  }
};

export const instructorCompletionConfig: YoureAllSetConfig = {
  title: "You're ready to teach!",
  subtitle: "Your instructor profile is complete",
  description: "You're all set to start teaching dance classes and building your student community. Let's share your passion!",
  buttonText: "Start Teaching",
  illustrationText: {
    main: "DANCE CLASS",
    sub: "TEACH"
  }
};

export const getCompletionConfig = (userType: 'dancer' | 'organizer' | 'instructor'): YoureAllSetConfig => {
  switch (userType) {
    case 'dancer':
      return dancerCompletionConfig;
    case 'organizer':
      return organizerCompletionConfig;
    case 'instructor':
      return instructorCompletionConfig;
    default:
      return dancerCompletionConfig;
  }
};

