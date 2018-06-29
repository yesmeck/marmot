'use strict';

const {
  Controller,
} = require('egg');

class GwController extends Controller {
  async index() {
    const data = this.ctx.request.body;
    let jobName;
    let buildNumber;
    try {
      jobName = data.environment && data.environment.jenkins.JOB_NAME;
      buildNumber = data.environment && data.environment.jenkins.BUILD_NUMBER;
    } catch (_) {
      this.ctx.body = {
        success: false,
        message: 'environment.jenkins.JOB_NAME and environment.jenkins.BUILD_NUMBER are required',
      };
      return;
    }
    await this.ctx.model.JobName.findOrCreate({
      where: {
        jobName,
      },
      defaults: {
        jobName,
      },
    });
    const gitBranch = data.gitCommitInfo.gitBranch;
    const createResult = await this.ctx.model.Build.create({
      buildNumber,
      jobName,
      gitBranch,
      data,
    });
    await this.ctx.service.webhook.push(data);
    this.ctx.body = {
      success: true,
      message: '',
      data: createResult,
    };
  }
}

module.exports = GwController;
