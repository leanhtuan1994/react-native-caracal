# Capture recipe

How the media in `./media` was produced on 2026-10-22, for re-capturing after UI changes.

## Setup

- Xcode 27.1; simulators **iPhone 18 Pro** (iOS 27.0) and **iPhone Duo** (iOS 27.1).
- Release build, fresh install (no dev menu, real bundle):

  ```bash
  xcrun simctl uninstall <UDID> com.caracal.development
  npx cross-env EXPO_NO_DOTENV=1 expo run:ios --configuration Release --no-bundler --device <UDID>
  ```

- Marketing status bar (clear it afterwards with `status_bar <UDID> clear`):

  ```bash
  xcrun simctl status_bar <UDID> override --time "9:41" --dataNetwork wifi \
    --wifiMode active --wifiBars 3 --cellularMode active --cellularBars 4 \
    --batteryState charged --batteryLevel 100
  ```

- Demo account: Emily Johnson / emily@example.com / `secret1`.

## Capture (no watermark)

- Screenshot: `xcrun simctl io <UDID> screenshot out.png`.
- iPhone Duo has several displays: cover = `--display=1` (1398×2034), inner = `--display=3`
  (2853×2007, already landscape, no rotation needed). List them with
  `xcrun simctl io <UDID> enumerate`.
- Video: `xcrun simctl io <UDID> recordVideo --codec=h264 [--display=N] out.mov`, stop with
  SIGINT. Only one recording per simulator at a time ("Host recording is already in
  progress"), so record the cover and inner displays in separate takes.
- `recordVideo` only writes frames when the screen changes, so a take can start with a long
  still segment. Find the active part with
  `ffmpeg -i out.mov -vf "select='gt(scene,0.003)',showinfo" -f null -` and trim with `-ss`.

## Encode

```bash
# stills
ffmpeg -i in.png -vf "scale=600:-1:flags=lanczos" tmp.png && cwebp -q 86 tmp.png -o out.webp
# video
ffmpeg -ss <start> -to <end> -i in.mov -vf "fps=30,scale=590:-2:flags=lanczos" \
  -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart -an out.mp4
# gif
ffmpeg -ss <start> -to <end> -i in.mov -vf "fps=8,scale=270:-1:flags=lanczos,split[a][b];\
[a]palettegen=max_colors=96:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" out.gif
```

Use 1000 px width for inner-display stills/video and 480 px for its GIF.
