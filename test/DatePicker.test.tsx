import React from 'react';

import { Form } from 'react-final-form';

import 'date-fns';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';

import { DatePicker } from '../src';
import { customRender, act } from './TestUtils';

interface ComponentProps {
	initialValues: FormData;
	validator?: any;
}

interface FormData {
	date: Date;
}

describe('DatePicker', () => {
	const defaultDateValue = '2019-10-18';
	const defaultDateString = `${defaultDateValue}T00:00:00`;

	const initialValues: FormData = {
		date: new Date(defaultDateString),
	};

	function DatePickerComponent({ initialValues, validator }: ComponentProps) {
		const onSubmit = (values: FormData) => {
			console.log(values);
		};

		const validate = async (values: FormData) => {
			if (validator) {
				return validator(values);
			}
		};

		return (
			<Form
				onSubmit={onSubmit}
				initialValues={initialValues}
				validate={validate}
				render={({ handleSubmit }) => (
					<form onSubmit={handleSubmit} noValidate>
						<DatePicker
							label="Test"
							name="date"
							inputFormat="yyyy-MM-dd"
						/>
					</form>
				)}
			/>
		);
	}

	it('renders without errors', async () => {
		await act(async () => {
			const rendered = customRender(<DatePickerComponent initialValues={initialValues} />);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders without dateFunsUtils', async () => {
		await act(async () => {
			const rendered = customRender(
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Form
						onSubmit={() => {
							expect(true).toBeTruthy();
						}}
						render={() => <DatePicker name="some_name" value={defaultDateString} inputFormat="yyyy-MM-dd" />}
					/>
				</LocalizationProvider>,
			);
			expect(rendered).toMatchSnapshot();
		});
	});

	it('renders the value with default data', async () => {
		const rendered = customRender(<DatePickerComponent initialValues={initialValues} />);
		const date = (await rendered.findByDisplayValue(defaultDateValue)) as HTMLInputElement;
		expect(date.value).toBe(defaultDateValue);
	});

	it('has the Test label', async () => {
		await act(async () => {
			const rendered = customRender(<DatePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('Test') as HTMLLegendElement;
			expect(elem.tagName).toBe('LABEL');
		});
	});

	it('has the required *', async () => {
		await act(async () => {
			const rendered = customRender(<DatePickerComponent initialValues={initialValues} />);
			const elem = rendered.getByText('*') as HTMLSpanElement;
			expect(elem.tagName).toBe('SPAN');
			expect(elem.innerHTML).toBe(' *');
		});
	});
});
