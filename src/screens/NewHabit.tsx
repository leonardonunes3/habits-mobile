import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Feather } from '@expo/vector-icons';

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function NewHabit() {
    const [checkedWeekDays, setCheckedWeekDays] = useState<number[]>([]);
    const [title, setTitle] = useState('');

    function handleToggleCheckedWeekDays(weekDayIndex: number) {
        if(checkedWeekDays.includes(weekDayIndex)) {
            setCheckedWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex));
        } else {
            setCheckedWeekDays(prevState => [...prevState, weekDayIndex]);
        }
    }

    async function handleCreateNewHabit() {
        try {
            if(!title.trim() || checkedWeekDays.length === 0) {
                Alert.alert('New Habit', "Type a habit and choose the recurrence");
            }

            await api.post('/habits', {
                title: title,
                weekDays: checkedWeekDays
            })

            setTitle('')
            setCheckedWeekDays([]);

            Alert.alert("New habit", "Habit created successfully")
        } catch (error) {
            console.log(error);
            Alert.alert('Oops', "Could not create new habit, try again later")
        }
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >

                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Create habit
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    What's your commitment?
                </Text>

                <TextInput 
                    className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                    placeholder="eg. exercise, sleep well, etc.."
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle}
                    value={title}
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    What's the recurrence?
                </Text>

                {
                    weekDays.map((weekDay, index) => (
                        <Checkbox 
                            key={weekDay}
                            title={weekDay}
                            checked={checkedWeekDays.includes(index)}
                            onPress={() => handleToggleCheckedWeekDays(index)}
                        />
                    ))
                }       
                
                <TouchableOpacity
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                    activeOpacity={0.7}
                    onPress={handleCreateNewHabit}
                >
                    <Feather 
                        name="check"
                        size={20}
                        color={colors.white}
                    />

                    <Text className="font-semibold text-base text-white ml-2">
                        Apply
                    </Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}