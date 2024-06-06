import React from "react";
import { Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import colors from "../theme/colors";
import Feed from "../components/Feed";
const catImageUrl =
  "https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=49ed3252c0b2ffb49cf8b508892e452d";

const Home = () => {

  return (
    <SafeAreaView  style={{backgroundColor:'#101010'}}>
      <ScrollView >
        <Feed/>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;