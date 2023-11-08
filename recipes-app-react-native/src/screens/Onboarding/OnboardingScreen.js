import React, { useEffect, useState } from "react";
import Onboarding from 'react-native-onboarding-swiper';
import { ScrollView, View, Text, Button } from 'react-native';
import OnboardingStoresScreen from './OnboardingStoresScreen';

const OnboardingScreen = ({ navigation }) => {
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const handleSignupOpen = () => {
    setIsSignupVisible(true);
  };
  return (
    <Onboarding
      onDone={() => navigation.navigate('Home')}

      showNext={false}
      showSkip={true}
      bottomBarColor="#fff"
      onSkip={() => navigation.navigate('Login')}
      pages={[

        {
          backgroundColor: '#fff',
          //   image: <Image source={require('')} />,
          title: 'Welcome to InstaFood',
          subtitle: 'Discover discounted ingredients near you and explore recipes that make the most of the best deals!',
        },
        {
          backgroundColor: '#fff',
          //   image: <Image source={require('./')} />,
          title: 'Explore the Features',
          subtitle: 'Scroll through our home page to discover stores, ingredients, and recipes. Dive into categories from the menu page for a more focused search.',
        },
        {
          backgroundColor: '#fff',
          // image: <Image source={require('./')} />,
          title: 'Get Started',
          subtitle: (
            <View>
              <Text>Log in or create an account to save your settings.</Text>
              <Button title="Log In" onPress={() => navigation.navigate('Login')} />
              <Button title="Sign Up" onPress={() => navigation.navigate('Signup')} />
              <Button title="Continue as Guest" onPress={() => navigation.navigate('Home')} />
            </View>
          ),
        }
      ]}
    />
  );
};

export default OnboardingScreen;



