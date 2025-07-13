import { danger, fail, warn, message } from 'danger';

// ✅ Always confirm Danger is working
message('👋 Hello from Danger! Reviewing your pull request...');

// 🚨 Fail if no PR description
if (!danger.github.pr.body || danger.github.pr.body.length < 10) {
    fail('❌ Please add a meaningful description to your PR.');
}

// ⚠️ Warn if the PR adds too many lines
const bigPRThreshold = 500;
const totalChanges =
    (danger.github.pr.additions || 0) + (danger.github.pr.deletions || 0);

if (totalChanges > bigPRThreshold) {
    warn(`⚠️ Big PR: ${totalChanges} lines changed. Consider splitting it up.`);
}

// ✅ Encourage testing
message('✅ Don’t forget to run the test suite before merging!');
