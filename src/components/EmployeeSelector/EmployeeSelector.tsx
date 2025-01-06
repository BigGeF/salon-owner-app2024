import React, { memo, useCallback } from 'react';
import { FlatList, TouchableOpacity, Image, View, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Employee } from '../../types/index';
import { useTranslation } from 'react-i18next';
import { styled } from 'nativewind';

// Define styled components
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

// Define the props interface for EmployeeSelectorItem
interface EmployeeSelectorItemProps {
  employee: Employee;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

// Individual Employee Selector Item Component
const EmployeeSelectorItem: React.FC<EmployeeSelectorItemProps> = memo(({ employee, isSelected, onSelect }) => (
  <StyledTouchableOpacity
    onPress={() => onSelect(employee._id)}
    className={`mr-4 p-2 rounded-full border ${
      isSelected ? 'border-blue-500' : 'border-gray-300'
    }`}
  >
    {employee.avatar ? (
      <Image
        source={{ uri: employee.avatar }}
        className="w-10 h-10 rounded-full"
      />
    ) : (
      <StyledView className="w-10 h-10 bg-gray-300 rounded-full justify-center items-center">
        <StyledText className="text-white font-bold">
          {employee.firstName.charAt(0)}
        </StyledText>
      </StyledView>
    )}
  </StyledTouchableOpacity>
));

// Define the props interface for AllSelectorItem
interface AllSelectorItemProps {
  isSelected: string | 'all';
  onSelect: (id: string | 'all') => void;
}

// Individual "All" Selector Item Component
const AllSelectorItem: React.FC<AllSelectorItemProps> = memo(({ isSelected, onSelect }) => (
  <StyledTouchableOpacity
    onPress={() => onSelect('all')}
    className={`mr-4 p-2 rounded-full border ${
      isSelected === 'all' ? 'border-blue-500' : 'border-gray-300'
    }`}
  >
    <StyledView className="w-10 h-10 bg-gray-500 rounded-full justify-center items-center">
      <FontAwesome name="users" size={20} color="white" />
    </StyledView>
  </StyledTouchableOpacity>
));

// Define the props interface for EmployeeSelector
interface EmployeeSelectorProps {
  employees: Employee[];
  selectedEmployeeId: string | 'all';
  onSelect: (employeeId: string | 'all') => void;
}

const EmployeeSelector: React.FC<EmployeeSelectorProps> = ({
  employees,
  selectedEmployeeId,
  onSelect,
}) => {
  const { t } = useTranslation();

  const renderEmployeeSelectorItem = useCallback(
    ({ item }: { item: Employee }) => (
      <EmployeeSelectorItem
        employee={item}
        isSelected={selectedEmployeeId === item._id}
        onSelect={onSelect}
      />
    ),
    [selectedEmployeeId, onSelect]
  );

  const renderAllSelectorItem = useCallback(
    () => (
      <AllSelectorItem
        isSelected={selectedEmployeeId}
        onSelect={onSelect}
      />
    ),
    [selectedEmployeeId, onSelect]
  );

  return (
    <StyledView className="px-4 py-2">
      <FlatList
        data={employees}
        keyExtractor={(employee) => employee._id}
        horizontal
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={renderAllSelectorItem}
        renderItem={renderEmployeeSelectorItem}
      />
    </StyledView>
  );
};

export default memo(EmployeeSelector);
