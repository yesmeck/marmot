'use strict';

const uuidv4 = require('uuid/v4');
const deploy = require('../../test/fixtures/deploy-data.json');
const data = JSON.stringify(deploy);

module.exports = {
  up: async queryInterface => {
    const buildUniqId = '00000000-0000-0000-0000-000000001000';
    await queryInterface.bulkInsert('deploys',
      new Array(30).fill().map(() => {
        return {
          source: 'https://gaius-favico.oss-cn-beijing.aliyuncs.com/dist.tgz',
          region: 'oss-cn-beijing',
          bucket: 'test-upload-tahm',
          prefix: 'test/tahm',
          acl: 'public-read',
          data,
          uniqId: uuidv4(),
          buildUniqId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      }));
  },

  down: async queryInterface => {
    await queryInterface.bulkDelete('deploys');
  },
};
