# Contributing

## General Workflow

1. Fork the repo
1. Clone down to local
2. Create an upstream remote to faceoff master. Pull from this often.
1. Make commits to your local master branch. Prefix each commit like so:
  - (feat) Added a new feature
  - (fix) Fixed inconsistent tests [Fixes #0]
  - (refactor) ...
  - (cleanup) ...
  - (test) ...
  - (doc) ...
1. Pull from upstream master and resolve conflicts before pushing to your fork origin on github
1. Push to your fork master
1. Create Pull request to Faceoff master
1. Approve your own approve request

## Details 

### Fork the repo

Use github’s interface to make a fork of the repo, then add that repo as an upstream remote:

```
git remote add upstream https://github.com/hackreactor-labs/<NAME_OF_REPO>.git
```




<!-- Links -->
[style guide]: https://github.com/hackreactor-labs/style-guide
[n-queens]: https://github.com/hackreactor-labs/n-queens
[Underbar]: https://github.com/hackreactor-labs/underbar
[curriculum workflow diagram]: http://i.imgur.com/p0e4tQK.png
[cons of merge]: https://f.cloud.github.com/assets/1577682/1458274/1391ac28-435e-11e3-88b6-69c85029c978.png
[Bookstrap]: https://github.com/hackreactor/bookstrap
[Taser]: https://github.com/hackreactor/bookstrap
[tools workflow diagram]: http://i.imgur.com/kzlrDj7.png
[Git Flow]: http://nvie.com/posts/a-successful-git-branching-model/
[GitHub Flow]: http://scottchacon.com/2011/08/31/github-flow.html
[Squash]: http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html
