#!/bin/bash

RELEASE_PREFIX=Version
BASEDIR=$(dirname $0)

# Set files paths
filePathChangelogGeneration="${BASEDIR}/./generate-changelog.sh"
filePathFilesToDelete="${BASEDIR}/../temp/files-to-delete.txt"

# Prepare dirs and files
mkdir -p "${BASEDIR}/../temp"

# Check that we are on correct branch
branchNameCurrent=`git rev-parse --abbrev-ref HEAD`
branchNameReleaseFrom=dev
branchNameReleaseTo=master
branchNameMergeTemp=mergeTemp
if [[ $branchNameCurrent != $branchNameReleaseFrom ]]; then
	echo "Current branch is '${branchNameCurrent}', but you need to be on '${branchNameReleaseFrom}' to make a release"
	exit 1
fi

# Check that there isn't uncommited files
if [ -n "$(git status --porcelain)" ]; then
	echo "There are changes, commit first"
	exit 1
fi

# Get current version from packaje.json file
re="\"version\"\:[[:space:]]*\"(([[:digit:]]+)\.([[:digit:]]+)\.([[:digit:]]+))\""
while read line; do
	if [[ $line =~ $re ]]; then
		currentVersion=${BASH_REMATCH[1]}
		currentVersionMajor=${BASH_REMATCH[2]}
		currentVersionMinor=${BASH_REMATCH[3]}
		currentVersionPatch=${BASH_REMATCH[4]}
	fi
done < package.json

# Check entered argument
# It should be 'patch', 'minor', 'major', or exact version
if [[ $1 == 'patch' ]]; then
	enteredVersionMajor=${currentVersionMajor}
	enteredVersionMinor=${currentVersionMinor}
	enteredVersionPatch=$(($currentVersionPatch + 1))
	enteredVersion="${enteredVersionMajor}.${enteredVersionMinor}.${enteredVersionPatch}"
elif [[ $1 == 'minor' ]]; then
	enteredVersionMajor=${currentVersionMajor}
	enteredVersionMinor=$(($currentVersionMinor + 1))
	enteredVersionPatch=0
	enteredVersion="${enteredVersionMajor}.${enteredVersionMinor}.${enteredVersionPatch}"
elif [[ $1 == 'major' ]]; then
	enteredVersionMajor=$(($currentVersionMajor + 1))
	enteredVersionMinor=0
	enteredVersionPatch=0
	enteredVersion="${enteredVersionMajor}.${enteredVersionMinor}.${enteredVersionPatch}"
else
	re="(([[:digit:]]+)\.([[:digit:]]+)\.([[:digit:]]+))"
	if ! [[ $1 =~ $re ]]; then
		echo "Release number is wrong"
		exit 1
	fi

	enteredVersion=${BASH_REMATCH[1]};
	enteredVersionMajor=${BASH_REMATCH[2]};
	enteredVersionMinor=${BASH_REMATCH[3]};
	enteredVersionPatch=${BASH_REMATCH[4]};
fi

# For exact entered version, check it to be above current
if
	(( $enteredVersionMajor < $currentVersionMajor )) ||
	(( $enteredVersionMajor == $currentVersionMajor && $enteredVersionMinor < $currentVersionMinor )) ||
	(( $enteredVersionMajor == $currentVersionMajor && $enteredVersionMinor == $currentVersionMinor  && $enteredVersionPatch < $currentVersionPatch )); then
	echo "Entered version ($enteredVersion) isn't above current ($currentVersion)"
	exit 1
fi

echo "Starting a new release: $enteredVersion"
git checkout "${branchNameReleaseTo}" && git pull origin "${branchNameReleaseTo}"

# Merge changes.
# This is a simulation of "git merge -s theirs" strategy (which doesn't exists).
# Method described here: https://stackoverflow.com/a/4969679.
git merge --squash --no-commit -s ours "${branchNameReleaseFrom}"
git commit -a -m "tmp"
git branch "${branchNameMergeTemp}"
git reset --hard "${branchNameReleaseFrom}"
git reset --soft "${branchNameMergeTemp}"
git branch -D "${branchNameMergeTemp}"

# Delete files that can't be deleted automatically during merge
git diff --name-status "${branchNameReleaseTo}" "${branchNameReleaseFrom}" | grep '^D' | sed 's/D[[:space:]]//' > "${filePathFilesToDelete}"
while read line; do
	rm -rf "${BASEDIR}/../${line}"
done < "${filePathFilesToDelete}"
rm -rf "${filePathFilesToDelete}"

# Create tag for the first time
# (it's necessary for autogenerated changelog)
git commit -m "${RELEASE_PREFIX} ${enteredVersion}"
lastCommitHash=`git log --pretty='format:%h' -1`
git tag -a "v${enteredVersion}" -m "${RELEASE_PREFIX} ${enteredVersion}" "${lastCommitHash}"
git push --tags

# Start generating changelog
/bin/bash "${filePathChangelogGeneration}"

# Update version in files that contains it
filesToReplace=(
	package.json
)
for file in "${filesToReplace[@]}"
do
	sed -i '' "s/$currentVersion/$enteredVersion/g" "$file"
done

# Make a production build
npm run build

# Hard replace new tag and commit,
# and now we are ready to push our changes to remote
git add .
git commit --amend -m "${RELEASE_PREFIX} ${enteredVersion}"
lastCommitHash=`git log --pretty='format:%h' -1`
git tag -d "v${enteredVersion}"
git push --delete origin "v${enteredVersion}"
git tag -a "v${enteredVersion}" -m "${RELEASE_PREFIX} ${enteredVersion}" "${lastCommitHash}"
git push --tags
git push origin "${branchNameReleaseTo}"

# Merge changes back into branch where we came from
git checkout "${branchNameReleaseFrom}"
git merge --squash --no-commit -X theirs "${branchNameReleaseTo}"
git commit -m "Merge v${enteredVersion} into ${branchNameReleaseFrom} back from ${branchNameReleaseTo}"

# Update remote and now we are ready to continue develop
git push origin "${branchNameReleaseFrom}"
