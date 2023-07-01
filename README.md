## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

# for development
ENVFILE=.env.development react-native run-ios  # for iOS
ENVFILE=.env.development react-native run-android  # for Android
# for production
ENVFILE=.env.production react-native run-ios --configuration Release  # for iOS
ENVFILE=.env.production react-native run-android --variant=release  # for Android
