require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  # Matches the podspec's own filename, which is what CocoaPods resolves a `:path` pod by.
  # It is the npm name without the scope, the way the haptics package beside this one does it.
  s.name         = "react-native-sound"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = { "Amr Shbib" => "amr.shbib@mythings.app" }
  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => package["repository"]["url"], :tag => "v#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"
  # AudioToolbox and nothing else: no AVFoundation, because nothing here opens an audio session.
  s.frameworks   = "AudioToolbox"

  s.dependency "React-Core"
end
