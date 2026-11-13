# Playwright + Jenkins beginner SDET project

This project practices browser login testing with Playwright and running the tests from a Jenkins Pipeline.

## Demo application

The tests use SauceDemo: https://www.saucedemo.com/

Demo credentials:
- Username: `standard_user`
- Password: `secret_sauce`

These are public demo credentials, not real account credentials.

## 1. Run locally

Install Node.js (LTS), then open a terminal in this project folder:

```bash
npm install
npx playwright install
npx playwright test
```

Open the HTML report:

```bash
npx playwright show-report
```

The report is generated in `playwright-report/`.

## 2. Test cases included

1. Valid username and password: user should reach the Products page.
2. Invalid password: an error should be displayed.
3. Empty credentials: a username-required validation message should be displayed.

## 3. Push to GitHub

Create an empty GitHub repository, then run:

```bash
git init
git add .
git commit -m "Add Playwright login tests and Jenkins pipeline"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your own repository URL.

## 4. Create the Jenkins Pipeline

Prerequisites:
- Jenkins is running.
- A Jenkins agent has Git, Node.js/npm and permission to install Playwright browser dependencies.
- The Jenkins agent can access the internet.

In Jenkins:
1. Select **New Item**.
2. Enter a job name, for example `playwright-login-tests`.
3. Select **Pipeline**, then select **OK**.
4. Under Pipeline, choose **Pipeline script from SCM**.
5. Set SCM to **Git**.
6. Enter your GitHub repository URL.
7. Set Branch Specifier to `*/main`.
8. Set Script Path to `Jenkinsfile`.
9. Save, then select **Build Now**.

The sample Jenkinsfile uses Linux shell commands (`sh`). For a Windows agent, replace these with appropriate `bat` commands and configure browser dependencies for Windows.

## 5. Connect GitHub to Jenkins with a webhook

First, make sure Jenkins is reachable by GitHub. A Jenkins server running only on `localhost` cannot receive GitHub webhooks directly.

In GitHub:
1. Open your repository.
2. Go to **Settings → Webhooks → Add webhook**.
3. Set Payload URL to `https://YOUR-JENKINS-URL/github-webhook/`.
4. Set Content type to `application/json`.
5. Select the push event.
6. Add the webhook.

In Jenkins, configure the job's build trigger to use the GitHub hook trigger if that option is available. The exact label depends on the installed GitHub integration/plugin. For a Pipeline from SCM, verify webhook delivery and job trigger configuration.

For a private repository, add Git credentials in **Manage Jenkins → Credentials** and select those credentials in the job's SCM configuration. Do not put tokens in the Jenkinsfile.

## 6. View failures

If a build fails:
1. Open the failed build.
2. Open **Console Output**.
3. Find the first meaningful error, not only the final `script returned exit code` line.
4. Expand the archived `playwright-report` artifact if it was created.
5. Inspect screenshots, videos and traces under `test-results` if present.

A failed test normally makes `npx playwright test` return a non-zero exit code, causing the Jenkins stage and build to fail.

## 7. Optional: publish JUnit test results in Jenkins

To display test counts in Jenkins' test report UI, add the Playwright JUnit reporter.

In `playwright.config.js`, change the reporter setting to:

```javascript
reporter: [
  ['list'],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['junit', { outputFile: 'test-results/e2e-junit-results.xml' }]
],
```

Then add this inside the Jenkinsfile `post { always { ... } }` block:

```groovy
junit testResults: 'test-results/e2e-junit-results.xml',
      allowEmptyResults: true
```

Install the Jenkins **JUnit Plugin** if it is not already installed.

## Troubleshooting notes

- For a repeatable CI install, run `npm install` locally and commit the generated `package-lock.json`; then you can change the Jenkinsfile command from `npm install` to `npm ci`.
- If browser installation fails on Jenkins, check that the agent has permission to install OS dependencies. You may instead use a Playwright Docker image or a preconfigured agent.
- If the tests fail due to network or demo-site availability, open SauceDemo in a browser and verify that the demo site is reachable.
- If Jenkins runs on Windows, `sh` will not work; use Windows batch steps or a Linux agent.
