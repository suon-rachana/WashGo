import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Input } from '@/src/components/ui';
import { Spacing } from '@/src/theme';

export interface AddressFormValues {
  label: string;
  street: string;
  city: string;
  province: string;
  notes: string;
}

export interface AddressFormProps {
  initialValues?: Partial<AddressFormValues>;
  submitLabel: string;
  onSubmit: (values: AddressFormValues) => void;
  loading?: boolean;
}

const EMPTY_VALUES: AddressFormValues = { label: '', street: '', city: '', province: '', notes: '' };

// Shared by app/addresses/add.tsx and app/addresses/edit.tsx — same fields,
// same validation, same layout; only the initial values, submit label, and
// what happens after submit differ per screen.
export function AddressForm({ initialValues, submitLabel, onSubmit, loading = false }: AddressFormProps) {
  const [values, setValues] = useState<AddressFormValues>({ ...EMPTY_VALUES, ...initialValues });

  const isComplete = !!values.label.trim() && !!values.street.trim() && !!values.city.trim() && !!values.province.trim();

  const setField = (field: keyof AddressFormValues) => (text: string) =>
    setValues((prev) => ({ ...prev, [field]: text }));

  return (
    <View style={styles.container}>
      <View style={styles.fields}>
        <Input
          label="Label"
          placeholder="e.g. Home, Work"
          value={values.label}
          onChangeText={setField('label')}
          editable={!loading}
        />
        <Input
          label="Street"
          placeholder="Street address"
          value={values.street}
          onChangeText={setField('street')}
          editable={!loading}
        />
        <Input label="City" placeholder="City" value={values.city} onChangeText={setField('city')} editable={!loading} />
        <Input
          label="Province"
          placeholder="Province"
          value={values.province}
          onChangeText={setField('province')}
          editable={!loading}
        />
        <Input
          label="Notes"
          placeholder="Gate code, landmark, delivery instructions..."
          multiline
          numberOfLines={3}
          value={values.notes}
          onChangeText={setField('notes')}
          editable={!loading}
        />
      </View>

      <Button
        title={submitLabel}
        fullWidth
        loading={loading}
        disabled={!isComplete || loading}
        onPress={() => onSubmit(values)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xl,
  },
  fields: {
    gap: Spacing.md,
  },
});
