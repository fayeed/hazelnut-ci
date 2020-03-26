import { Application, Context } from "probot";
import Webhooks from "@octokit/webhooks";
import { getConfig } from "./utils";
import PouchDB from "pouchdb";
import PouchDBFind from "pouchdb-find";
import { HeadCommit } from "./models";
// import uuid from "uuid/v4";

PouchDB.plugin(PouchDBFind);
const db = new PouchDB("local");

// TODO: Figure out the structure of the database
export = (app: Application) => {
  // TODO: Persistent build - same thing with event `check_run.rerequested`
  // * 1. make new entry in the database using uuidv4
  // * 2. initialize the first check based on the steps mentioned in the config
  // * 3. Persist the check id in the database to later update the checks
  app.on("push", async (context: Context<Webhooks.WebhookPayloadPush>) => {
    const { config, entrypoint, error } = await getConfig(context, app)!;

    // * If there is an error close imediately
    if (error) {
      return;
    }

    // * Based on the active flow run a check and select build flow.
    if (entrypoint === "workflows") {
    } else if (entrypoint === "build") {
    }

    const {
      repository: {
        name,
        owner: { login }
      },
      head_commit
    } = context.payload;

    const { id } = head_commit! as HeadCommit;

    await context.github.checks.create({
      name: "Default Name",
      owner: login,
      repo: name,
      head_sha: id
    });
  });

  app.on(
    "check_run.rerequested",
    async (context: Context<Webhooks.WebhookPayloadCheckRun>) => {
      const { entrypoint, error } = await getConfig(context, app)!;

      // * If there is an error close imediately
      if (error) {
        return;
      }

      // * Based on the active flow run a check and select build flow.
      if (entrypoint === "workflows") {
      } else if (entrypoint === "build") {
      }

      const {
        repository: {
          name,
          owner: { login }
        },
        check_run: { head_sha }
      } = context.payload;

      await context.github.checks.create({
        name: "Default Name",
        owner: login,
        repo: name,
        head_sha
      });
    }
  );

  // * 1. Run the current step & update the checks
  // * 2. Once the step is complete update the check based on failure or success
  // * 3. If success trigger `check_run.completed` else
  app.on(
    "check_run.created",
    async (context: Context<Webhooks.WebhookPayloadCheckRun>) => {
      const { entrypoint, error } = await getConfig(context, app)!;

      // * If there is an error close imediately
      if (error) {
        return;
      }

      // * Based on the active flow run a check and select build flow.
      if (entrypoint === "workflows") {
      } else if (entrypoint === "build") {
      }

      const {
        repository: {
          name,
          owner: { login }
        },
        check_run: { id }
      } = context.payload;

      const startTime = new Date();

      await context.github.checks.update({
        owner: login,
        repo: name,
        check_run_id: id,
        status: "in_progress",
        started_at: startTime.toISOString()
      });
    }
  );
};
