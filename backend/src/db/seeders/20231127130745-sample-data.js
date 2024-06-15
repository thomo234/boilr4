const db = require('../models');
const Users = db.users;

const Exhibitions = db.exhibitions;

const Messages = db.messages;

const Pages = db.pages;

const Portfolios = db.portfolios;

const Profiles = db.profiles;

const Settings = db.settings;

const Tenants = db.tenants;

const ExhibitionsData = [
  {
    title: 'Summer Art Show',

    gallery: 'Art Gallery NYC',

    credits: 10,

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    title: 'Digital Art Expo',

    gallery: 'London Digital Gallery',

    credits: 15,

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    title: 'Berlin Design Week',

    gallery: 'Berlin Design Center',

    credits: 20,

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const MessagesData = [
  {
    content: 'Hello, how are you?',

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    content: 'Can we collaborate on a project?',

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    content: 'Your work is amazing!',

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const PagesData = [
  {
    title: 'Home Page',

    content: '<h1>Welcome to my portfolio</h1>',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    title: 'About Me',

    content: '<p>This is the about me section.</p>',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    title: 'Gallery',

    content: '<h1>My Artworks</h1>',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const PortfoliosData = [
  {
    title: 'Sunset Photography',

    description: 'A collection of sunset photos.',

    price: 100,

    issue_number: 1,

    dimensions: '1920x1080',

    // type code here for "images" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    title: 'Urban Exploration',

    description: 'Photos from urban exploration.',

    price: 150,

    issue_number: 2,

    dimensions: '1920x1080',

    // type code here for "images" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    title: 'Digital Art',

    description: 'A collection of digital artworks.',

    price: 200,

    issue_number: 1,

    dimensions: '1920x1080',

    // type code here for "images" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const ProfilesData = [
  {
    name: 'John Doe',

    location: 'New York, USA',

    about: 'Photographer and artist.',

    subdomain: 'johns-portfolio',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Jane Smith',

    location: 'London, UK',

    about: 'Digital artist and designer.',

    subdomain: 'jane-art',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },

  {
    name: 'Admin User',

    location: 'San Francisco, USA',

    about: 'Platform administrator.',

    subdomain: 'admin',

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_many" field

    // type code here for "relation_one" field
  },
];

const SettingsData = [
  {
    dark_mode: true,

    custom_css: 'body { background-color: white; }',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    dark_mode: true,

    custom_css: 'body { background-color: black; }',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    dark_mode: true,

    custom_css: 'body { background-color: white; }',

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const TenantsData = [
  {
    name: 'Louis Victor de Broglie',
  },

  {
    name: 'Charles Sherrington',
  },

  {
    name: 'Galileo Galilei',
  },
];

// Similar logic for "relation_many"

async function associateUserWithTenant() {
  const relatedTenant0 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setTenant) {
    await User0.setTenant(relatedTenant0);
  }

  const relatedTenant1 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setTenant) {
    await User1.setTenant(relatedTenant1);
  }

  const relatedTenant2 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setTenant) {
    await User2.setTenant(relatedTenant2);
  }
}

async function associateExhibitionWithProfile() {
  const relatedProfile0 = await Profiles.findOne({
    offset: Math.floor(Math.random() * (await Profiles.count())),
  });
  const Exhibition0 = await Exhibitions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Exhibition0?.setProfile) {
    await Exhibition0.setProfile(relatedProfile0);
  }

  const relatedProfile1 = await Profiles.findOne({
    offset: Math.floor(Math.random() * (await Profiles.count())),
  });
  const Exhibition1 = await Exhibitions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Exhibition1?.setProfile) {
    await Exhibition1.setProfile(relatedProfile1);
  }

  const relatedProfile2 = await Profiles.findOne({
    offset: Math.floor(Math.random() * (await Profiles.count())),
  });
  const Exhibition2 = await Exhibitions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Exhibition2?.setProfile) {
    await Exhibition2.setProfile(relatedProfile2);
  }
}

async function associateExhibitionWithTenant() {
  const relatedTenant0 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Exhibition0 = await Exhibitions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Exhibition0?.setTenant) {
    await Exhibition0.setTenant(relatedTenant0);
  }

  const relatedTenant1 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Exhibition1 = await Exhibitions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Exhibition1?.setTenant) {
    await Exhibition1.setTenant(relatedTenant1);
  }

  const relatedTenant2 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Exhibition2 = await Exhibitions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Exhibition2?.setTenant) {
    await Exhibition2.setTenant(relatedTenant2);
  }
}

async function associateMessageWithSender() {
  const relatedSender0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Message0 = await Messages.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Message0?.setSender) {
    await Message0.setSender(relatedSender0);
  }

  const relatedSender1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Message1 = await Messages.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Message1?.setSender) {
    await Message1.setSender(relatedSender1);
  }

  const relatedSender2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Message2 = await Messages.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Message2?.setSender) {
    await Message2.setSender(relatedSender2);
  }
}

async function associateMessageWithReceiver() {
  const relatedReceiver0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Message0 = await Messages.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Message0?.setReceiver) {
    await Message0.setReceiver(relatedReceiver0);
  }

  const relatedReceiver1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Message1 = await Messages.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Message1?.setReceiver) {
    await Message1.setReceiver(relatedReceiver1);
  }

  const relatedReceiver2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Message2 = await Messages.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Message2?.setReceiver) {
    await Message2.setReceiver(relatedReceiver2);
  }
}

async function associateMessageWithTenant() {
  const relatedTenant0 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Message0 = await Messages.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Message0?.setTenant) {
    await Message0.setTenant(relatedTenant0);
  }

  const relatedTenant1 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Message1 = await Messages.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Message1?.setTenant) {
    await Message1.setTenant(relatedTenant1);
  }

  const relatedTenant2 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Message2 = await Messages.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Message2?.setTenant) {
    await Message2.setTenant(relatedTenant2);
  }
}

async function associatePageWithProfile() {
  const relatedProfile0 = await Profiles.findOne({
    offset: Math.floor(Math.random() * (await Profiles.count())),
  });
  const Page0 = await Pages.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Page0?.setProfile) {
    await Page0.setProfile(relatedProfile0);
  }

  const relatedProfile1 = await Profiles.findOne({
    offset: Math.floor(Math.random() * (await Profiles.count())),
  });
  const Page1 = await Pages.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Page1?.setProfile) {
    await Page1.setProfile(relatedProfile1);
  }

  const relatedProfile2 = await Profiles.findOne({
    offset: Math.floor(Math.random() * (await Profiles.count())),
  });
  const Page2 = await Pages.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Page2?.setProfile) {
    await Page2.setProfile(relatedProfile2);
  }
}

async function associatePageWithTenant() {
  const relatedTenant0 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Page0 = await Pages.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Page0?.setTenant) {
    await Page0.setTenant(relatedTenant0);
  }

  const relatedTenant1 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Page1 = await Pages.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Page1?.setTenant) {
    await Page1.setTenant(relatedTenant1);
  }

  const relatedTenant2 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Page2 = await Pages.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Page2?.setTenant) {
    await Page2.setTenant(relatedTenant2);
  }
}

async function associatePortfolioWithProfile() {
  const relatedProfile0 = await Profiles.findOne({
    offset: Math.floor(Math.random() * (await Profiles.count())),
  });
  const Portfolio0 = await Portfolios.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Portfolio0?.setProfile) {
    await Portfolio0.setProfile(relatedProfile0);
  }

  const relatedProfile1 = await Profiles.findOne({
    offset: Math.floor(Math.random() * (await Profiles.count())),
  });
  const Portfolio1 = await Portfolios.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Portfolio1?.setProfile) {
    await Portfolio1.setProfile(relatedProfile1);
  }

  const relatedProfile2 = await Profiles.findOne({
    offset: Math.floor(Math.random() * (await Profiles.count())),
  });
  const Portfolio2 = await Portfolios.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Portfolio2?.setProfile) {
    await Portfolio2.setProfile(relatedProfile2);
  }
}

async function associatePortfolioWithTenant() {
  const relatedTenant0 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Portfolio0 = await Portfolios.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Portfolio0?.setTenant) {
    await Portfolio0.setTenant(relatedTenant0);
  }

  const relatedTenant1 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Portfolio1 = await Portfolios.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Portfolio1?.setTenant) {
    await Portfolio1.setTenant(relatedTenant1);
  }

  const relatedTenant2 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Portfolio2 = await Portfolios.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Portfolio2?.setTenant) {
    await Portfolio2.setTenant(relatedTenant2);
  }
}

// Similar logic for "relation_many"

// Similar logic for "relation_many"

// Similar logic for "relation_many"

async function associateProfileWithTenant() {
  const relatedTenant0 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Profile0 = await Profiles.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Profile0?.setTenant) {
    await Profile0.setTenant(relatedTenant0);
  }

  const relatedTenant1 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Profile1 = await Profiles.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Profile1?.setTenant) {
    await Profile1.setTenant(relatedTenant1);
  }

  const relatedTenant2 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Profile2 = await Profiles.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Profile2?.setTenant) {
    await Profile2.setTenant(relatedTenant2);
  }
}

async function associateSettingWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Setting0 = await Settings.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Setting0?.setUser) {
    await Setting0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Setting1 = await Settings.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Setting1?.setUser) {
    await Setting1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Setting2 = await Settings.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Setting2?.setUser) {
    await Setting2.setUser(relatedUser2);
  }
}

async function associateSettingWithTenant() {
  const relatedTenant0 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Setting0 = await Settings.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Setting0?.setTenant) {
    await Setting0.setTenant(relatedTenant0);
  }

  const relatedTenant1 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Setting1 = await Settings.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Setting1?.setTenant) {
    await Setting1.setTenant(relatedTenant1);
  }

  const relatedTenant2 = await Tenants.findOne({
    offset: Math.floor(Math.random() * (await Tenants.count())),
  });
  const Setting2 = await Settings.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Setting2?.setTenant) {
    await Setting2.setTenant(relatedTenant2);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Exhibitions.bulkCreate(ExhibitionsData);

    await Messages.bulkCreate(MessagesData);

    await Pages.bulkCreate(PagesData);

    await Portfolios.bulkCreate(PortfoliosData);

    await Profiles.bulkCreate(ProfilesData);

    await Settings.bulkCreate(SettingsData);

    await Tenants.bulkCreate(TenantsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithTenant(),

      await associateExhibitionWithProfile(),

      await associateExhibitionWithTenant(),

      await associateMessageWithSender(),

      await associateMessageWithReceiver(),

      await associateMessageWithTenant(),

      await associatePageWithProfile(),

      await associatePageWithTenant(),

      await associatePortfolioWithProfile(),

      await associatePortfolioWithTenant(),

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      // Similar logic for "relation_many"

      await associateProfileWithTenant(),

      await associateSettingWithUser(),

      await associateSettingWithTenant(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('exhibitions', null, {});

    await queryInterface.bulkDelete('messages', null, {});

    await queryInterface.bulkDelete('pages', null, {});

    await queryInterface.bulkDelete('portfolios', null, {});

    await queryInterface.bulkDelete('profiles', null, {});

    await queryInterface.bulkDelete('settings', null, {});

    await queryInterface.bulkDelete('tenants', null, {});
  },
};
