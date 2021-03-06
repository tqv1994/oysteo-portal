import pkg from 'google-libphonenumber';
const { PhoneNumberUtil, PhoneNumberFormat } = pkg;
const phoneUtil = PhoneNumberUtil.getInstance();

export function convert2InternationalPhone(phoneNumber: string, countryCode: string) {
	if (
		phoneNumber == 'null' ||
		phoneNumber == null ||
		phoneNumber == '' ||
		countryCode == null ||
		countryCode == ''
	) {
		return '';
	}
	phoneNumber = convert2NationalPhone(phoneNumber, countryCode);
	const number = phoneUtil.parseAndKeepRawInput(phoneNumber.toString(), countryCode);
	return '+' + number.getCountryCode() + ' ' + number.getRawInput().split('-').join(' ');
}

export function convert2NationalPhone(phoneNumber: string, countryCode: string) {
	if (
		phoneNumber == 'null' ||
		phoneNumber == null ||
		phoneNumber == '' ||
		countryCode == null ||
		countryCode == ''
	) {
		return '';
	}
	const number = phoneUtil.parse(phoneNumber.toString(), countryCode);
	return number.getNationalNumber();
}

export function isValidPhoneNumber(phoneNumber: string, countryCode: string) {
	if (
		phoneNumber == 'null' ||
		phoneNumber == null ||
		phoneNumber == '' ||
		countryCode == null ||
		countryCode == ''
	) {
		return true;
	}
	try {
		const number = phoneUtil.parseAndKeepRawInput(phoneNumber.toString(), countryCode);
		if (countryCode == null || countryCode == '') {
			return phoneUtil.isValidNumber(number);
		}
		return phoneUtil.isValidNumberForRegion(number, countryCode);
	} catch (err) {
		return false;
	}
}

export function encodehoneNumber(phoneNumber: string, countryCode: string): string {
  return phoneUtil.format(phoneUtil.parse(phoneNumber + '', countryCode),PhoneNumberFormat.E164 )
}