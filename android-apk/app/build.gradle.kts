plugins { id("com.android.application") }

android {
    namespace = "com.easa66.quiz.pwa"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.easa66.quiz.pwa"
        minSdk = 24
        targetSdk = 35
        versionCode = 1
        versionName = "2.4.6"
    }
}

dependencies {
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("androidx.webkit:webkit:1.12.1")
}
