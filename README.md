# Cantrill.io Course Runtime & Progress Tracker

A Tampermonkey userscript that enhances the Cantrill.io learning platform by adding course runtime information and progress tracking directly to the course sidebar.

## Features

- **📊 Total Video Runtime**: Calculates and displays the total duration of all video content in a course
- **⏱️ Time Remaining**: Shows estimated remaining video time based on your current progress
- **🎯 Visual Integration**: Seamlessly integrates with the existing course design
- **📱 Collapsible Details**: Advanced statistics hidden under an expandable section
- **🔄 Real-time Updates**: Refresh button to recalculate runtime as needed
- **🎨 Clean UI**: Matches the native Cantrill.io design language

## What It Shows

### Main Display
- **Total Video Time**: Complete duration of all video lessons (e.g., "45h 20m")
- **Time Remaining**: Estimated time left based on your progress (e.g., "29h 5m")
- **Progress Indicator**: Visual progress bar with completion percentage

### Expandable Details
- **Video Lessons**: Count of lessons with duration information
- **Other Content**: Non-video items (quizzes, resources, etc.)
- **Coverage**: Percentage of course items with video duration data
- **Total Seconds**: Raw calculation data

## Installation

1. **Install Tampermonkey** browser extension:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. **Install the script**:
   - Click [here to install](cantrill-course-runtime-tracker.user.js) (raw file link)
   - Or copy the script content and create a new userscript in Tampermonkey

3. **Visit any Cantrill.io course** and the runtime tracker will automatically appear in the sidebar

## Supported Pages

- `https://learn.cantrill.io/p/*` - Course preview pages
- `https://learn.cantrill.io/courses/*` - Course content pages

## How It Works

The script:
1. **Scans the course curriculum** for video lessons with duration information
2. **Parses time formats** like "(6:28)", "[17:32]", etc.
3. **Calculates total runtime** from all detected video durations
4. **Reads your progress** from the existing progress bar
5. **Estimates remaining time** based on completion percentage
6. **Embeds the information** in a visually consistent sidebar widget

## Technical Details

- **Time Format Support**: Handles MM:SS and HH:MM:SS formats
- **Flexible Parsing**: Works with various HTML structures and whitespace
- **Progress Integration**: Reads completion data from existing UI elements
- **Responsive Design**: Matches native styling and responsive behavior
- **Error Handling**: Graceful fallbacks for missing or malformed data

## Screenshots

*Runtime tracker integrated into the course sidebar, showing total video time and remaining duration based on progress.*

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the script.

## License

MIT License - feel free to modify and distribute as needed.

## Author

Neil Bryan ([@njbryan](https://github.com/njbryan))

---

*This script is not affiliated with or endorsed by Cantrill.io. It's a community tool to enhance the learning experience.*
