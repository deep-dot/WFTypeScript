/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, FC} from 'react';
import {Image, TouchableOpacity, SafeAreaView} from 'react-native';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Assuming that calender.png is in the same directory as this file
const calendarIcon = require('./calender.png');

interface CalendarProps {
  value: string;
  onChange: (date: string, day: string) => void;
}

export const Calendar = ({onChange, value}: CalendarProps) => {
  const [show, setShow] = useState(false);

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const hideDatePicker = () => {
    setShow(false);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = moment(date).format('M/D/YY');
    // const formattedDate = moment(date).format('YYYY/MM/DD');
    const dayOfWeek = daysOfWeek[date.getDay()];

    onChange(formattedDate, dayOfWeek);
    setShow(false);
  };

  return (
    <SafeAreaView>
      <TouchableOpacity
        style={{
          width: 40,
          height: 40,
        }}
        onPress={showDatePicker}>
        <Image source={calendarIcon} style={{width: 45, height: 45}} />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={show}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  );
};
