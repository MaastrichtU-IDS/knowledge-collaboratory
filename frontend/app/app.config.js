
export default {
  name: 'Knowledge Collaboratory',
  version: '1.0.0',
  extra: {
    frontendUrl: process.env.FRONTEND_URL,
  },
  description:'Browse and publish RDF Nanopublications with the Knowledge Collaboratory.',
  slug: "knowledge-collaboratory",
  privacy: "public",
  sdkVersion: "35.0.0",
  platforms: ["web"],
  version: "0.0.1",
  icon: "./assets/icon.png",
  orientation: "portrait",
  packagerOpts: {
    assetExts: ["html"]
  }
};
