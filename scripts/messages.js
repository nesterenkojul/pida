export const color_list = ['#E74B4B', '#A6DEE4', '#EDCA6B', '#DC95B7', '#D3D6AD', '#929ADD'];
//['#DF8181', '#33B071', '#ECB26B', '#AD91BF', '#A6DEE4', '#A27449'];
//['#eb444f', '#76e041', '#3ed2ff', '#ff913d', '#b090ff', '#fface7'];

// Uploaded file size limits in MB
export const file_count_limit = 500,
    total_file_size_limit = 5000,
    single_file_size_limit = 10,
    csv_file_size_limit = 10;

export var welcome, small_screen, very_small_screen, 
no_data, yes_data, field_choice_unavailable, cancel_btn, 
total_count_exceeds, total_size_exceeds, single_size_exceeds,
duplicate_file_names, wrong_file_type, not_csv, 
csv_size_exceeds, confirm_files, confirm_csv;


export var language;


export function eng() {
    language = 'eng';

    var logo = document.createElement("img");
    logo.src = 'assets/logo_eng.svg';
    document.getElementById('header').appendChild(logo);

    welcome = 
        `<h1>Welcome to Playful Interface for Digital Archives.<br>
        Here you can visually explore the structure of your digitized collection.<br>
        <sub>Open the left menu to start.</sub></h1>`;

    small_screen = 
        `Un oh.<br>
        Your screen dimensions are a bit too extreme.<br>
        <sub>Please, increase the window size.</sub>`;

    very_small_screen = 
        `<sub>Please, increase the window size.</sub>`;

    no_data = 
        `<h1>We don't have enough data yet.<br>
        <sub>Open the left menu.</sub></h1>`;

    yes_data = 
        `<h1>We've got your data.<br>
        Now at least select the ID field.<br>
        <sub>Open the right menu.</sub></h1>`;

    field_choice_unavailable = 
        `<h1>Field choice is available only after you have uploaded your data.<br>
        <sub>Open the left menu.</sub></h1>`;

    cancel_btn = "Cancel selection";

    total_count_exceeds = 
        `Total collection size cannot exceed ${file_count_limit} items.<br> 
        Please, try again.`;

    total_size_exceeds = 
        `Total collection size cannot exceed ${total_file_size_limit / 1000} GB.<br> 
        Selected files together are %.<br>
        Please, try again.`;
    
    single_size_exceeds = 
        `Every file in the collection cannot exceed ${single_file_size_limit} MB.<br> 
        Stumbled upon a file of size %.<br>
        Please, try again.`;

    duplicate_file_names = 
        `Unique file name constraint failed.<br>
        File <i>%name</i> has a duplicate.<br>
        Please, try again.`;

    wrong_file_type = 
        `Stumbled upon a file of type %.<br>
        Sorry, only PDF, PNG, JPG and JPEG are accepted.<br>
        Please, try again.`;

    not_csv = 
        `Chosen file has a type %.<br>
        Sorry, only CSV-files are accepted.<br>
        Please, try again.`;

    csv_size_exceeds = 
        `File cannot exceed 5 MB.<br>
        Selected file size is %.<br>
        Please, try again.`;

    confirm_files = 
        `%count files selected.<br> 
        Total file size: %size.`;

    confirm_csv = 
        `Selected file <i>%name</i>.<br> 
        File size: %size.`;
}


export function rus() {
    language = 'rus';

    var logo = document.createElement("img");
    logo.src = 'assets/logo_rus.svg';
    document.getElementById('header').appendChild(logo);
    
    welcome = 
        `<h1>Добро пожаловать. Это ПИЦА.<br>
        Понятный Интерфейс для Цифровых Архивов.<br>
        Здесь вы можете визуально изучить структуру вашей цифровизированной коллекции.<br>
        <sub>Откройте левое меню, чтобы начать.</sub></h1>`;

    small_screen = 
        `Ой ой.<br>
        У вашего экрана слишком экстримальные пропорции.<br>
        <sub>Пожалуйста, увеличьте размер окна.</sub>`;

    very_small_screen = 
        `<sub>Пожалуйста, увеличьте размер окна.</sub>`;

    no_data = 
        `<h1>У нас пока недостаточно данных.<br>
        <sub>Откройте левое меню.</sub></h1>`;

    yes_data = 
        `<h1>Теперь мы можем работать с вашими данными.<br>
        Но для этого нужно выбрать как минимум столбец ID.<br>
        <sub>Откройте правое меню.</sub></h1>`;

    field_choice_unavailable = 
        `<h1>Выбор столбцов доступен только после загрузки данных.<br>
        <sub>Откройте левое меню.</sub></h1>`;

    cancel_btn = "Отменить выбор";

    total_count_exceeds = 
        `Размер коллекции не должен превышать ${file_count_limit} объектов.<br> 
        Пожалуйста, попробуйте ещё раз.`;

    total_size_exceeds = 
        `Суммарный объём коллекции не должен превышать ${total_file_size_limit / 1000} GB.<br> 
        Общий размер выбранных файлов: %.<br>
        Пожалуйста, попробуйте ещё раз.`;
    
    single_size_exceeds = 
        `Каждый файл в коллекции не должен превышать ${single_file_size_limit} MB.<br> 
        Мы наткнулись на файл размера %.<br>
        Пожалуйста, попробуйте ещё раз.`;

    duplicate_file_names = 
        `Нарушено правило об уникальности имен файлов.<br>
        У файла <i>%name</i> есть дубликат.<br>
        Пожалуйста, попробуйте ещё раз.`;

    wrong_file_type = 
        `Мы наткнулись на файл типа %.<br>
        Извините, принимаются только PDF, PNG, JPG и JPEG.<br>
        Пожалуйста, попробуйте ещё раз.`;

    not_csv = 
        `Выбранный файл имеет тип %.<br>
        Извините, принимаются только CSV-файлы.<br>
        Пожалуйста, попробуйте ещё раз.`;

    csv_size_exceeds = 
        `Размер файла не должен превышать 5 MB.<br>
        Выбранный файл %.<br>
        Пожалуйста, попробуйте ещё раз.`;

    confirm_files = 
        `Выбрано %count файлов.<br> 
        Суммарный размер выборки: %size.`;

    confirm_csv = 
        `Выбран файл <i>%name</i>.<br> 
        Размер файла: %size.`;
}