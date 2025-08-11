# Cantrill.io Course Runtime & Progress Tracker

A Tampermonkey userscript that enhances the Cantrill.io learning platform by adding **video-based progress tracking** and accurate runtime calculations directly to the course sidebar.

## 🚀 **New in Version 2.0: Video-Based Progress Tracking**

Unlike the course percentage (which includes quizzes, resources, etc.), this script now tracks your **actual video completion** for much more accurate time estimates!

## Features

- **🎥 Video-Based Progress**: Tracks completed videos vs total videos for accurate progress
- **📊 Dual Progress Display**: Shows both video progress and course progress for comparison
- **⏱️ Accurate Time Remaining**: Calculates remaining time based on actual video completion
- **✅ Completion Detection**: Automatically detects which videos you've completed
- **🎯 Visual Integration**: Seamlessly integrates with the existing course design
- **📱 Collapsible Details**: Advanced statistics hidden under an expandable section
- **🔄 Real-time Updates**: Refresh button to recalculate progress as needed
- **🎨 Clean UI**: Matches the native Cantrill.io design language

## What It Shows

### Main Display
- **Total Video Time**: Complete duration of all video lessons (e.g., "45h 20m")
- **Video Progress**: Percentage and time completed based on actual videos (e.g., "42% (18h 30m)")
- **Time Remaining**: Accurate remaining time based on video completion (e.g., "26h 50m")
- **Progress Bar**: Visual representation of video completion progress

### Progress Comparison
- **📹 Video Progress**: 42% (time-based tracking)
- **📚 Course Progress**: 36% (includes quizzes, resources)

*Shows why video-based tracking gives more accurate time estimates!*

### Expandable Details
- **Video Lessons**: Count of lessons with duration information
- **Completed Videos**: Number and time of completed videos
- **Remaining Videos**: Number and time of remaining videos
- **Other Content**: Non-video items (quizzes, resources, etc.)
- **Coverage**: Percentage of course items with video duration data

## Installation

1. **Install Tampermonkey** browser extension:
   - [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)
   - [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. **Install the script**:
   - Click [here to install](https://github.com/njbryan/cantrill-course-runtime-tracker/raw/main/cantrill-course-runtime-tracker.user.js) (direct install link)
   - Or copy the script content and create a new userscript in Tampermonkey

3. **Visit any Cantrill.io course** and the runtime tracker will automatically appear in the sidebar

## Supported Pages

- `https://learn.cantrill.io/p/*` - Course preview pages
- `https://learn.cantrill.io/courses/*` - Course content pages

## How It Works

The enhanced script:
1. **Scans the course curriculum** for video lessons with duration information
2. **Detects completed videos** using multiple completion indicators (checkmarks, button text, CSS classes)
3. **Calculates video-specific progress** separate from overall course progress
4. **Parses time formats** like "(6:28)", "[17:32]", etc.
5. **Provides accurate time estimates** based on actual video completion
6. **Compares metrics** showing both video progress and course progress
7. **Embeds the information** in a visually consistent sidebar widget

## Why Video-Based Tracking is Better

### Traditional Course Progress Issues:
- ❌ Includes non-video content (quizzes, PDFs, resources) in percentage
- ❌ May not accurately reflect actual study time needed
- ❌ Could be based on "items completed" rather than "time spent"

### Video-Based Progress Benefits:
- ✅ **More accurate time estimates** based on actual video content
- ✅ **Real-time progress** as you complete videos
- ✅ **Better study planning** with precise remaining time calculations
- ✅ **Tracks what matters** for time management

## Technical Details

- **Completion Detection**: Uses multiple methods to detect completed videos (CSS classes, icons, button text)
- **Time Format Support**: Handles MM:SS and HH:MM:SS formats
- **Flexible Parsing**: Works with various HTML structures and whitespace
- **Progress Integration**: Reads both video completion and course completion data
- **Responsive Design**: Matches native styling and responsive behavior
- **Error Handling**: Graceful fallbacks for missing or malformed data

## Example Output

```
VIDEO RUNTIME TRACKER
Total Video Time: 45h 20m
Video Progress: 42% (18h 30m)
Time Remaining: 26h 50m

[Progress Bar: 42% complete]
18 of 43 videos completed

Comparison:
📹 Video Progress: 42% (time-based tracking)
📚 Course Progress: 36% (includes quizzes, resources)
```

## Screenshots

*Runtime tracker integrated into the course sidebar, showing video-based progress tracking with accurate time estimates.*

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the script.

## Changelog

### Version 2.0
- ✨ **NEW**: Video-based progress tracking
- ✨ **NEW**: Completion detection for individual videos
- ✨ **NEW**: Dual progress display (video vs course)
- ✨ **NEW**: More accurate time remaining calculations
- ✨ **NEW**: Enhanced progress bar with video completion
- 🔧 **IMPROVED**: Better statistics in collapsible details section

### Version 1.0
- Initial release with basic runtime calculation
- Course progress integration
- Collapsible details section

## License

MIT License - feel free to modify and distribute as needed.

## Author

Neil Bryan ([@njbryan](https://github.com/njbryan))

---

*This script is not affiliated with or endorsed by Cantrill.io. It's a community tool to enhance the learning experience with more accurate progress tracking.*
